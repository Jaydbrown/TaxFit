

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { handleApiError } from '@/lib/api-client'; 

import type { Attorney, AttorneySearchFilters, AuthResponse } from '@/types'; 

interface SubmitVerificationInput {
    hourlyRate: number;
    consultationFee: number;
    minConsultationDuration: number;
    maxConsultationDuration: number;
    specializations: string[];
    bio: string;
}

interface VerificationStatusResponse {
    success: boolean;
    data: {
        verificationStatus: 'draft' | 'pending' | 'approved' | 'rejected';
        submittedForVerificationAt?: string;
        rejectionReason?: string;
        rejectionDetails?: string;
        missingRequirements?: string[]; 
    };
}

interface AdminVerificationListResponse {
    success: boolean;
    data: {
        attorneys: Attorney[];
        total: number;
        totalPages: number;
        page: number;
    };
}

interface AdminReviewInput {
    status: 'approved' | 'rejected';
    adminNotes?: string;
    rejectionReason?: string;
    rejectionDetails?: string;
}

interface AttorneyDetailsResponse {
    success: boolean;
    data: Attorney;
}

export function useAdminVerificationList(filters: AttorneySearchFilters & { page: number; limit: number; status?: string; sortBy?: string; sortOrder?: string; search?: string; }) {
    
    return useQuery<AdminVerificationListResponse['data'], unknown>({
        queryKey: ['adminVerificationList', filters],
        queryFn: async () => {
            const response = await apiClient.get<AdminVerificationListResponse>('/admin/attorneys/verification', {
                params: filters,
            });
            return response.data.data;
        },
        staleTime: 60 * 1000, 
    });
}

export function useSubmitVerification() {
    const queryClient = useQueryClient();
    
    return useMutation<AuthResponse, unknown, SubmitVerificationInput>({
        mutationFn: async (data) => {
            const response = await apiClient.post<AuthResponse>('/attorney/submit-verification', data);
            return response.data;
        },
        onSuccess: () => {
            // Invalidate status so the component fetches the new 'pending' status
            queryClient.invalidateQueries({ queryKey: ['attorneyVerificationStatus'] });
            toast.success('Verification request submitted!');
        },
        onError: (error) => {
            toast.error(handleApiError(error) ?? 'Verification submission failed.');
        },
    });
}

export function useUploadDocument() {
    const queryClient = useQueryClient();
    
    // NOTE: Mutation payload type depends on how you handle File objects/FormData
    return useMutation<AuthResponse, unknown, FormData>({
        mutationFn: async (formData) => {
            const response = await apiClient.post<AuthResponse>('/attorney/upload-document', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attorneyVerificationStatus'] });
            toast.success('Document uploaded successfully!');
        },
        onError: (error) => {
            toast.error(handleApiError(error) ?? 'Document upload failed.');
        },
    });
}

export function useAdminAttorneyDetails(attorneyId: string) {
    const isEnabled = !!attorneyId;
    
    return useQuery<AttorneyDetailsResponse['data'], unknown>({
        queryKey: ['attorneyDetails', attorneyId],
        queryFn: async () => {
            const response = await apiClient.get<AttorneyDetailsResponse>(`/admin/attorneys/${attorneyId}/verification`);
            return response.data.data;
        },
        enabled: isEnabled,
        staleTime: 5 * 60 * 1000, 
    });
}

export function useReviewVerification() {
    const queryClient = useQueryClient();

    return useMutation<AuthResponse, unknown, { attorneyId: string, data: AdminReviewInput }>({
        mutationFn: async ({ attorneyId, data }) => {
            const response = await apiClient.put<AuthResponse>(`/admin/attorneys/${attorneyId}/verification/review`, data);
            return response.data;
        },
        onSuccess: (data, variables) => {
            toast.success(data.message || 'Verification status updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['adminVerificationList'] });
            queryClient.invalidateQueries({ queryKey: ['attorneyDetails', variables.attorneyId] });
        },
        onError: (error) => {
            toast.error(handleApiError(error) ?? 'Failed to process review.');
        },
    });
}

export function useVerificationStatus() {
    return useQuery<VerificationStatusResponse['data'], unknown>({
        queryKey: ['attorneyVerificationStatus'],
        queryFn: async () => {
            const response = await apiClient.get<VerificationStatusResponse>('/attorney/verification-status');
            return response.data.data;
        },
        // We typically refetch frequently on a status page
        staleTime: 30 * 1000, // 30 seconds
        // onError: (error) => {
        //     // Error here might mean the user isn't an attorney or a server error
        //     console.error("Failed to fetch verification status:", error);
        //     // This toast is often suppressed on the status page itself, 
        //     // but included here for hook integrity.
        //     // toast.error(handleApiError(error) ?? "Could not retrieve verification status.");
        // }
    });
}