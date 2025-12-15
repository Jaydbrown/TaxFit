// src/hooks/admin/use-admin-users.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'react-hot-toast';

import type { 
    UserListResult, 
    UserFilters, 
} from '@/types/admin-types'; // Importing the types defined above


// 1. Fetch User List Hook (GET /api/v1/admin/users)
export function useAdminUserList(filters: UserFilters) {
    
    return useQuery<UserListResult, unknown>({
        queryKey: ['adminUserList', filters],
        queryFn: async () => {
            const { data } = await apiClient.get('/admin/users', {
                params: filters,
            });
            return data.data; 
        },
    });
}

// 2. Update Subscription Mutation Hook (PUT /api/v1/admin/users/{userId}/subscription)
export function useUpdateUserSubscription() {
    const queryClient = useQueryClient();

    interface SubscriptionVars {
        userId: string;
        isPremium: boolean;
        planId?: string;
    }

    return useMutation<any, unknown, SubscriptionVars>({
        mutationFn: async ({ userId, isPremium, planId }: SubscriptionVars) => {
            const response = await apiClient.put(`/admin/users/${userId}/subscription`, {
                isPremium,
                planId,
            });
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data.message || 'User subscription status updated.');
            // Invalidate the list to refresh the table and show the new status
            queryClient.invalidateQueries({ queryKey: ['adminUserList'] });
        },
        onError: () => {
            toast.error('Failed to update subscription.');
        },
    });
}