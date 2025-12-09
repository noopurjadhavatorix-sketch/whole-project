class ApiInterceptor {
  constructor() {
    if (typeof window === 'undefined') {
      // Skip initialization in SSR/SSG
      return;
    }
    
    if (window.fetch === this.originalFetch) {
      // Already initialized
      return;
    }
    
    this.originalFetch = window.fetch;
    this.initInterceptor();
  }

  initInterceptor() {
    const self = this;
    window.fetch = async function(...args) {
      try {
        // Intercept request
        const interceptedArgs = self.interceptRequest
          ? await self.interceptRequest(...args)
          : args;

        // Make the original fetch call
        const response = await self.originalFetch(...interceptedArgs);

        // Intercept response if needed
        if (self.interceptResponse) {
          try {
            // If response is an error, the interceptor will throw
            await self.interceptResponse(response, args);
          } catch (error) {
            // The error has already been logged in interceptResponse
            throw error; // Re-throw to maintain error handling in the original fetch chain
          }
        }

        return response;
      } catch (error) {
        console.error('Fetch interceptor error:', error);
        throw error;
      }
    };
  }

  /**
   * Intercept and modify requests
   * @param {...any} args - Original fetch arguments
   * @returns {Promise<Array>} Modified fetch arguments
   */
  async interceptRequest(...args) {
    const [url, options = {}] = args;
    const newOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
      },
    };
    
    return [url, newOptions];
  }

  /**
   * Handle responses
   * @param {Response} response - The fetch response
   * @param {Array} originalArgs - Original fetch arguments
   * @returns {Promise<void>}
   */
  async interceptResponse(response, originalArgs) {
    // Only handle error responses
    if (response.ok) return response;
    
    try {
      const contentType = response.headers.get('content-type') || '';
      let errorData = { message: 'An error occurred' };
      
      // Get the response text once
      const responseText = await response.text();
      
      // Try to parse as JSON if content-type suggests it's JSON
      try {
        errorData = contentType.includes('application/json') && responseText 
          ? JSON.parse(responseText) 
          : { message: responseText || 'Unknown error occurred' };
      } catch (e) {
        errorData = { message: responseText || 'Invalid JSON response' };
      }

      // Create a more detailed error object
      const errorInfo = {
        status: response.status,
        statusText: response.statusText,
        url: typeof originalArgs[0] === 'string' 
          ? originalArgs[0] 
          : (originalArgs[0] && originalArgs[0].url) || 'unknown',
        error: errorData
      };

      // Log the error for debugging
      console.error('API Error:', errorInfo);
      
      // Handle specific status codes
      if (response.status === 401) {
        // Clear any existing auth data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          sessionStorage.removeItem('atorix_auth_token');
          // Only redirect if not already on the login page
          if (!window.location.pathname.includes('/admin/login')) {
            window.location.href = '/admin/login';
          }
        }
      }

      // Throw the error to be caught by the caller
      throw errorInfo;
    } catch (error) {
      // Catch any errors in the interceptor itself
      console.error('Error in response interceptor:', error);
      throw error; // Re-throw the error
    }
  }
}

// Initialize the interceptor only on client-side
let apiInterceptor;
if (typeof window !== 'undefined') {
  apiInterceptor = new ApiInterceptor();
}

export default apiInterceptor;
