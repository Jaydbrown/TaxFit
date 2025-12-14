// src/hooks/admin/use-admin-auth.ts

import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client'; 
import { toast } from 'react-hot-toast';
import { handleApiError } from '@/lib/api-client';
import { useAdminAuthStore, AdminUser } from '@/store/use-admin-auth-store'; // Import types and store

// Assuming these base types exist in your system
import type { AuthResponse, LoginInput, RegisterInput } from '@/types'; 


/**
 * Hook for Admin Login using POST /api/v1/auth/loginadmin
 */
export function useAdminLogin() {
    const { setAdminTokens, setAdminUser } = useAdminAuthStore(); 
    
    return useMutation<AuthResponse, unknown, LoginInput>({
        mutationFn: async (data) => {
            const response = await apiClient.post<AuthResponse>('/auth/loginadmin', data);
            return response.data;
        },
        onSuccess: (data) => {
            const adminUserData = data.data.user as unknown as AdminUser;

            setAdminTokens(data.data.tokens || null);
            setAdminUser(adminUserData);
            
            toast.success('Admin login successful!');
        },
        onError: (error) => {
            toast.error(handleApiError(error) ?? 'Admin login failed.');
        },
    });
}


export function useAdminRegister() {
    return useMutation<AuthResponse, unknown, RegisterInput>({
        mutationFn: async (data) => {
            const response = await apiClient.post<AuthResponse>('/auth/registeradmin', data);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Admin registration successful!');
        },
        onError: (error) => {
            toast.error(handleApiError(error) ?? 'Admin registration failed.');
        },
    });
}