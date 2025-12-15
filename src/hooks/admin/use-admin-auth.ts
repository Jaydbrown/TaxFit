// src/hooks/admin/use-verification.ts (Completed Hooks)

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'react-hot-toast';

import type { 
    AdminVerificationFilters, 
    AdminVerificationResult, 
    AdminVerificationAttorneyDetails,
    ReviewVerificationPayload 
} from '@/types/admin-types'; 

// NOTE: Clean filters utility is omitted here but assumed to be implemented globally or in a separate file

// 1. Fetch List Hook (GET /api/v1/admin/attorneys/verification)
export function useAdminVerificationList(filters: AdminVerificationFilters) {
    const cleanedFilters = filters; // Assuming cleaning is handled elsewhere
    
    return useQuery<AdminVerificationResult, unknown>({
        queryKey: ['adminVerificationList', cleanedFilters],
        queryFn: async () => {
            const { data } = await apiClient.get('/admin/attorneys/verification', {
                params: cleanedFilters,
            });
            return data.data; 
        },
    });
}

// 2. Fetch Single Attorney Details Hook (GET /api/v1/admin/attorneys/{attorneyId}/verification)
export function useAdminAttorneyDetails(attorneyId: string) {
    return useQuery<AdminVerificationAttorneyDetails, unknown>({
        queryKey: ['adminAttorneyDetails', attorneyId],
        queryFn: async () => {
            const { data } = await apiClient.get(`/admin/attorneys/${attorneyId}/verification`);
            return data.data;
        },
        enabled: !!attorneyId,
    });
}

// 3. Review Verification Mutation Hook (PUT /api/v1/admin/attorneys/{attorneyId}/verification/review)
// FIX: Updated mutation function signature to match the page component's usage.
export function useReviewVerification() {
    const queryClient = useQueryClient();

    interface ReviewMutationVars {
        attorneyId: string;
        data: ReviewVerificationPayload;
    }

    return useMutation<any, unknown, ReviewMutationVars>({
        mutationFn: async ({ attorneyId, data }) => {
            const response = await apiClient.put(`/admin/attorneys/${attorneyId}/verification/review`, data);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Verification reviewed successfully!');
            // Invalidate the list and the detail page after a successful review
            queryClient.invalidateQueries({ queryKey: ['adminVerificationList'] });
            // The detail page key should be passed dynamically, or we use a more general invalidate
            queryClient.invalidateQueries({ queryKey: ['adminAttorneyDetails'] }); 
        },
        onError: () => {
             toast.error("Failed to submit verification review.");
        }
    });
}

// 4. Document Verification Mutation Hook (PUT /api/v1/admin/attorneys/{attorneyId}/verification/documents/{documentId}/verify)
export function useVerifyDocument() {
    const queryClient = useQueryClient();

    interface DocumentVerifyVars {
        attorneyId: string;
        documentId: string;
        notes?: string;
    }

    return useMutation<any, unknown, DocumentVerifyVars>({
        mutationFn: async ({ attorneyId, documentId, notes }) => {
            const response = await apiClient.put(
                `/admin/attorneys/${attorneyId}/verification/documents/${documentId}/verify`, 
                { notes, verifiedStatus: 'verified' }
            );
            return response.data;
        },
        onSuccess: () => {
            toast.success("Document marked as verified!");
            // Refresh the detail page to show the updated document status
            queryClient.invalidateQueries({ queryKey: ['adminAttorneyDetails'] });
        },
         onError: () => {
             toast.error("Failed to verify document.");
        }
    });
}