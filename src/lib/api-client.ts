// src/lib/api-client.ts

import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';
// We need to dynamically import the store inside the interceptor to avoid a circular dependency
// with hooks that might import the client.

// --- Configuration ---
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// --- Create axios instance ---
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- 1. Request Interceptor (Adding the Access Token) ---
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// --- 2. Response Interceptor (Token Refresh and Error Handling) ---
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    // Helper to trigger Zustand logout and redirect
    const logoutAndRedirect = async (reason: string) => {
        console.error(`Authentication failed: ${reason}. Logging out.`);
        
        // Dynamically import useAuthStore to avoid circular dependencies
        const { useAuthStore } = await import('@/store/auth-store');
        const logout = useAuthStore.getState().logout;
        
        logout(); // Clears Zustand state and local storage keys
        
        // Use window.location.replace to perform a hard redirect and clear history
        window.location.replace('/login');
    };


    // --- Token Refresh Logic (Retry on 401) ---
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (!refreshToken) {
            return logoutAndRedirect("No refresh token available");
        }
        
        // Request token refresh (using base axios instance to avoid infinite interceptor loop)
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;

        // Update tokens in localStorage
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
        
        // Update headers and retry original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);

      } catch (refreshError) {
        // Refresh token failed (e.g., refresh token expired or invalid)
        return logoutAndRedirect("Token refresh failed");
      }
    }
    
    // --- General Error Handling (Non-401 or failed retry) ---
    
    // Check for specific error message structure from backend
    const errors = error.response?.data?.errors;
    const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';

    if (errors && Array.isArray(errors)) {
      // If backend returns an array of validation errors
      errors.forEach((err: string) => toast.error(err));
    } else if (errorMessage) {
      // Show generic or single backend error message
      toast.error(errorMessage);
    }
    
    // Re-throw error for specific component/hook error handling
    return Promise.reject(error);
  }
);

export default apiClient;

// --- Helper Functions (Updated) ---

/**
 * Helper function to extract user-friendly error message from unknown API error objects.
 */
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    const backendMessage = axiosError.response?.data?.message;
    const errorsArray = axiosError.response?.data?.errors;

    if (errorsArray && Array.isArray(errorsArray) && errorsArray.length > 0) {
        // Return the first error if a list of errors is provided (e.g., validation errors)
        return errorsArray[0];
    }
    // Return the single backend message or a generic error
    return backendMessage || 'A network error occurred or the server is unreachable.';
  }
  return 'An unexpected client error occurred.';
};

/**
 * Gathers simplified device information for logging or API context.
 */
export const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  let browser = 'Unknown';

  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';

  return {
    deviceType: /Mobile|Android|iPhone|iPod|BlackBerry|IEMobile/i.test(userAgent) ? 'mobile' : 'desktop',
    os: navigator.platform,
    browser: browser,
  };
};