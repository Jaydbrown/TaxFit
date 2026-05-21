import axios, { AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// State to track the refresh token request status
let isRefreshing = false;
// Queue stores promises (with their resolve/reject) for failed requests to retry later
let failedQueue: Array<{ 
    config: InternalAxiosRequestConfig; 
    resolve: (value: AxiosResponse<any>) => void; 
    reject: (reason?: any) => void 
}> = [];

// FIX 1: Simplified and corrected processQueue function
const processQueue = (error: AxiosError | null, accessToken: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else if (accessToken && prom.config.headers) {
            // Success: update the header and retry the request
            prom.config.headers.Authorization = `Bearer ${accessToken}`;
            apiClient(prom.config).then(prom.resolve).catch(prom.reject);
        } else {
             // Handle case where accessToken is null after refresh attempt
            prom.reject(new Error("Failed to retrieve new access token."));
        }
    });

    failedQueue = [];
    isRefreshing = false;
};


const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
// ... (request interceptor remains unchanged)
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

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    const logoutAndRedirect = async (reason: string, isRefreshFailure = false) => {
        console.error(`Authentication failed: ${reason}. Logging out.`);
        
        const { useAuthStore } = await import('@/store/auth-store');
        useAuthStore.getState().logout();
        toast.error('Session expired or authentication failed. Please log in again.');
        
        if (isRefreshFailure) {
            window.location.replace('/login');
        }
        // We reject with the original error so the calling component can handle it
        return Promise.reject(error); 
    };


    // --- Token Refresh Logic (Retry on 401) ---
    if (status === 401 && originalRequest.url !== `${API_BASE_URL}/auth/refresh-token` && !originalRequest._retry) {
      
      if (isRefreshing) {
        // FIX 2: Queue the request using a new Promise to wait for the refresh
        return new Promise((resolve, reject) => {
            failedQueue.push({ config: originalRequest, resolve, reject });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      
      if (!refreshToken) {
        processQueue(error, null); // Reject all queued requests
        return logoutAndRedirect("No refresh token available", true);
      }
        
      try {
        // Request token refresh
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;

        // Update tokens
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
        
        // Update headers for the original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Process all queued requests (null error means success)
        processQueue(null, accessToken); 
        
        // FIX 3: Return the result of the retried original request (Promise<AxiosResponse>)
        return apiClient(originalRequest); 

      } catch (refreshError) {
        // Refresh token failed
        processQueue(error, null); // Reject all queued requests with the original error
        return logoutAndRedirect("Token refresh failed", true); 
      }
    }
    

    // Check for specific error message structure from backend
    const errors = error.response?.data?.errors;
    const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';

    if (errors && Array.isArray(errors)) {
      errors.forEach((err: string) => toast.error(err));
    } else if (errorMessage && status !== 401) { 
      toast.error(errorMessage);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

// --- Helper Functions (RESTORED NAMED EXPORTS) ---

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