// src/hooks/admin/use-admin-payouts.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'react-hot-toast';

// Assuming you are importing types from the file created above:
import type { 
    PayoutListResult, 
    PayoutFilters, 
} from '@/types/admin-types'; 


// 1. Fetch Payout List Hook (GET /api/v1/admin/transactions/payouts)
export function useAdminPayouts(filters: PayoutFilters) {
    // Note: The search filter from the UI is not directly mapped to the PayoutFilters type 
    // here, but can be added to the queryFn params if the backend supports it.
    
    return useQuery<PayoutListResult, unknown>({
        queryKey: ['adminPayouts', filters],
        queryFn: async () => {
            const { data } = await apiClient.get('/admin/transactions/payouts', {
                params: filters,
            });
            return data.data; 
        },
    });
}

// 2. Process Payout Mutation Hook (PUT /api/v1/admin/transactions/payouts/{id}/process)
export function useProcessPayout() {
    const queryClient = useQueryClient();

    interface ProcessVars {
        payoutId: string;
        processorRef: string; // The transaction reference
    }

    return useMutation<any, unknown, ProcessVars>({
        mutationFn: async ({ payoutId, processorRef }: ProcessVars) => {
            const response = await apiClient.put(`/admin/transactions/payouts/${payoutId}/process`, {
                processorRef,
            });
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Payout successfully processed.');
            // Invalidate the list to refresh the table and move the item out of 'pending'
            queryClient.invalidateQueries({ queryKey: ['adminPayouts'] });
        },
        onError: () => {
            toast.error('Failed to process payout. Check server logs.');
        },
    });
}