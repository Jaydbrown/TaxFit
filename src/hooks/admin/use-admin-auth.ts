// src/hooks/admin/use-admin-auth.ts

import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client'; 
import { toast } from 'react-hot-toast';
import { handleApiError } from '@/lib/api-client';

// FIX: Import the new Admin Store
import { useAdminAuthStore } from '@/store/use-admin-auth-store';

import type { 
    AuthResponse, 
    LoginInput, 
    RegisterInput,
    AdminUser 
} from '@/types'; // Ensure AdminUser is accessible here


/**
 * Hook for Admin Login using POST /api/v1/auth/loginadmin
 */
export function useAdminLogin() {
    // FIX: Destructure session setters from the Admin Store
    const { setAdminTokens, setAdminUser } = useAdminAuthStore(); 
    
    return useMutation<AuthResponse, unknown, LoginInput>({
        mutationFn: async (data) => {
            const response = await apiClient.post<AuthResponse>('/auth/loginadmin', data);
            return response.data;
        },
        onSuccess: (data) => {
            // FIX: Set Admin session state
            setAdminTokens(data.data.tokens || null);
            setAdminUser(data.data.user as AdminUser); // Cast to AdminUser type
            
            toast.success('Admin login successful!');
            // Redirect logic would be handled in the component
        },
        onError: (error) => {
            toast.error(handleApiError(error));
        },
    });
}

/**
 * Hook for Admin Registration using POST /api/v1/auth/registeradmin
 */
export function useAdminRegister() {
    // Note: Registration doesn't usually set the session immediately
    
    return useMutation<AuthResponse, unknown, RegisterInput>({
        mutationFn: async (data) => {
            const response = await apiClient.post<AuthResponse>('/auth/registeradmin', data);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Admin registration successful!');
            // Redirect to login or verification page
        },
        onError: (error) => {
            toast.error(handleApiError(error));
        },
    });
}