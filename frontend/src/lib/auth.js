/**
 * Authentication utilities for dashboard access
 */

import { apiRequest, API_ENDPOINTS, getApiUrl } from './api';

/**
 * Check if credentials are valid by calling the API
 * @param {string} username - The username to check
 * @param {string} password - The password to check
 * @returns {Promise<{success: boolean, token?: string, user?: object, message?: string}>} - Authentication result
 */
export async function validateCredentials(username, password) {
  try {
    const response = await fetch(getApiUrl(API_ENDPOINTS.LOGIN), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies/sessions
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Authentication failed');
    }

    if (data && data.success) {
      // Store the token in sessionStorage
      if (data.token) {
        setAuthToken(data.token, data.user);
      }
      
      return {
        success: true,
        token: data.token,
        user: data.user || { username }
      };
    }

    return {
      success: false,
      message: data?.message || 'Authentication failed. Please check your credentials.'
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      message: error.message || 'Authentication failed. Please try again.'
    };
  }
}

/**
 * Store authentication token and user data in sessionStorage
 * @param {string} token - The JWT token
 * @param {object} user - The user data
 */
export function setAuthToken(token, user = null) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('atorix_auth_token', token);
    if (user) {
      sessionStorage.setItem('atorix_user', JSON.stringify(user));
    }
  }
  return token;
}

/**
 * Get the current user data
 * @returns {object|null} The user data or null if not authenticated
 */
export function getCurrentUser() {
  if (typeof window !== 'undefined') {
    const user = sessionStorage.getItem('atorix_user');
    return user ? JSON.parse(user) : null;
  }
  return null;
}

/**
 * Remove authentication token and user data from sessionStorage
 */
export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('atorix_auth_token');
    sessionStorage.removeItem('atorix_user');
    localStorage.removeItem('token');
  }
}

/**
 * Check if user is authenticated
 * @returns {boolean} - Whether the user is authenticated
 */
export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  
  const token = sessionStorage.getItem('atorix_auth_token');
  if (!token) return false;

  // Optional: Add token expiration check here if needed
  // const decoded = jwtDecode(token);
  // if (decoded.exp * 1000 < Date.now()) {
  //   clearAuthToken();
  //   return false;
  // }

  return true;
}

/**
 * Login user
 * @param {string} username - The username
 * @param {string} password - The password
 * @returns {Promise<{success: boolean, message?: string, token?: string, user?: object}>} - Result object with success and message
 */
export async function login(username, password) {
  try {
    const result = await validateCredentials(username, password);

    if (result.success && result.token) {
      setAuthToken(result.token, result.user);
      return {
        success: true,
        token: result.token,
        user: result.user
      };
    }

    return {
      success: false,
      message: result.message || 'Invalid username or password'
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred during login'
    };
  }
}

/**
 * Logout user
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    // Call the logout API endpoint
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // Important for including cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Logout API error:', error);
    // Continue with client-side cleanup even if API call fails
  } finally {
    // Clear all client-side storage
    clearAuthToken();
  }
}
