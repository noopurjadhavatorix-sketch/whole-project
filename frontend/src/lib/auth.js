/**
 * Authentication utilities for dashboard access
 */

import { apiRequest, API_ENDPOINTS } from './api';

/**
 * Check if credentials are valid by calling the API
 * @param {string} username - The username/email to check
 * @param {string} password - The password to check
 * @returns {Promise<{success: boolean, token?: string, message?: string}>} - Authentication result
 */
export async function validateCredentials(username, password) {
  try {
    const response = await apiRequest(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    return response;
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      message: error.message || 'Authentication failed. Please try again.'
    };
  }
}

/**
 * Store authentication token in sessionStorage
 * @param {string} token - The authentication token
 */
export function setAuthToken(token) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('atorix_auth_token', token);
    return token;
  }
  return null;
}

/**
 * Remove authentication token from sessionStorage
 */
export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('atorix_auth_token');
    localStorage.removeItem('token');
    sessionStorage.clear();
  }
}

/**
 * Check if user is authenticated
 * @returns {boolean} - Whether the user is authenticated
 */
export function isAuthenticated() {
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('atorix_auth_token');
    return !!token;
  }
  return false;
}

/**
 * Login user
 * @param {string} username - The username/email
 * @param {string} password - The password
 * @returns {Promise<{success: boolean, message?: string}>} - Result object with success and message
 */
export async function login(username, password) {
  const result = await validateCredentials(username, password);

  if (result.success && result.token) {
    setAuthToken(result.token);
    return {
      success: true,
      token: result.token
    };
  }

  return {
    success: false,
    message: result.message || 'Invalid username or password'
  };
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
