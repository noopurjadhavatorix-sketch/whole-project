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
    // Handle common response scenarios
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: originalArgs[0],
        error,
      });
      
      // Handle specific status codes
      if (response.status === 401) {
        // Handle unauthorized
        // Example: Redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
      }
    }
    
    // You can add more response handling logic here
    return response;
  }
}

// Initialize the interceptor only on client-side
let apiInterceptor;
if (typeof window !== 'undefined') {
  apiInterceptor = new ApiInterceptor();
}

export default apiInterceptor;
