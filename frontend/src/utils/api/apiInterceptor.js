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

        // Clone the response before reading it
        const clonedResponse = response.clone();

        // Intercept response if needed
        if (self.interceptResponse) {
          try {
            await self.interceptResponse(clonedResponse, args);
          } catch (error) {
            console.error('Error in response interceptor:', error);
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
   * Override this method to intercept and modify requests
   * @param {...any} args - Original fetch arguments
   * @returns {Promise<Array>} Modified fetch arguments
   */
  async interceptRequest(...args) {
    // Add your request interception logic here
    // Example: Add auth headers
    const [url, options = {}] = args;
    const newOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        // Add other default headers here
      },
    };
    
    return [url, newOptions];
  }

  /**
   * Override this method to handle responses
   * @param {Response} response - The fetch response
   * @param {Array} originalArgs - Original fetch arguments
   * @returns {Promise<void>}
   */
  async interceptResponse(response, originalArgs) {
    try {
      // Only try to handle error responses
      if (!response.ok) {
        let errorData = {};
        const contentType = response.headers.get('content-type');
        
        // Only try to parse JSON if the content-type is application/json
        if (contentType && contentType.includes('application/json')) {
          try {
            errorData = await response.clone().json();
          } catch (parseError) {
            // If JSON parsing fails, try to get text instead
            try {
              const text = await response.clone().text();
              errorData = { message: text || 'Unknown error occurred' };
            } catch (textError) {
              errorData = { message: 'Failed to parse error response' };
            }
          }
        } else {
          // For non-JSON responses, get the text
          try {
            const text = await response.clone().text();
            errorData = { message: text || 'Unknown error occurred' };
          } catch (textError) {
            errorData = { message: 'Failed to parse error response' };
          }
        }

        // Create a more detailed error object
        const errorInfo = {
          status: response.status,
          statusText: response.statusText,
          url: typeof originalArgs[0] === 'string' ? originalArgs[0] : originalArgs[0]?.url || 'unknown',
          error: errorData,
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

        // Return a rejected promise with the error info
        return Promise.reject(errorInfo);
      }
      
      // For successful responses, just return the response
      return response;
    } catch (error) {
      // Catch any errors in the interceptor itself
      console.error('Error in response interceptor:', error);
      return response; // Still return the original response
    }
  }
}

// Initialize the interceptor only on client-side
let apiInterceptor;
if (typeof window !== 'undefined') {
  apiInterceptor = new ApiInterceptor();
}

export default apiInterceptor;
