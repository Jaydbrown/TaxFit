// src/hooks/attorney/use-verification.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client'; 
import { toast } from 'react-hot-toast';
// Import types from the finalized file
import type { 
    Attorney, 
    AuthResponse, 
    AttorneySearchFilters, 
    AttorneySearchResult, 
    AttorneyProfile, 
    User,
} from '@/types';
// Assuming the handleApiError helper is imported or defined
import { handleApiError } from '@/lib/api-client';


// --- Shared Response Types ---

interface AttorneyDetailsResponse {
    success: boolean;
    data: Attorney; // Attorney is the combined User + AttorneyProfile type
}

interface VerificationStatusResponse {
    success: boolean;
    data: {
        isProfileComplete: boolean;
        isVerifiedAttorney: boolean;
        verificationStatus: 'pending' | 'approved' | 'rejected' | 'draft';
        submittedForVerificationAt?: string;
        missingRequirements: string[];
        rejectionReason?: string;
        rejectionDetails?: string;
    };
}

interface DocumentUploadInput {
    documentType: string;
    documentUrl: string;
}

// --- 1. ATTORNEY (User-Side) HOOKS ---

// Submission payload structure based on Swagger
interface SubmitVerificationInput extends Partial<AttorneyProfile> {
    hourlyRate: number;
    consultationFee: number;
    minConsultationDuration: number;
    maxConsultationDuration: number;
    specializations: string[];
    bio: string;
    // ... add education/certifications fields if needed
}

/**
 * Hook to submit the attorney profile details for admin review.
 */
export function useSubmitVerification() {
    const queryClient = useQueryClient();
    
    return useMutation<AuthResponse, unknown, SubmitVerificationInput>({
        mutationFn: async (data) => {
            const response = await apiClient.post<AuthResponse>('/attorney/submit-verification', data);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Profile submitted for verification successfully!');
            // Invalidate the status query to reflect the 'pending' state immediately
            queryClient.invalidateQueries({ queryKey: ['attorneyVerificationStatus'] });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
        onError: (error) => {
            toast.error(handleApiError(error));
        },
    });
}

/**
 * Hook to check the current attorney verification status.
 */
export function useVerificationStatus() {
    return useQuery<VerificationStatusResponse['data'], unknown>({
        queryKey: ['attorneyVerificationStatus'],
        queryFn: async () => {
            const response = await apiClient.get<VerificationStatusResponse>('/attorney/verification-status');
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to upload professional documents required for verification.
 */
export function useUploadDocument() {
    const queryClient = useQueryClient();

    return useMutation<AuthResponse, unknown, DocumentUploadInput>({
        mutationFn: async (data) => {
            const response = await apiClient.post<AuthResponse>('/attorney/upload-document', data);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Document uploaded successfully!');
            // Invalidate status to check if requirements are now met
            queryClient.invalidateQueries({ queryKey: ['attorneyVerificationStatus'] });
        },
        onError: (error) => {
            toast.error(handleApiError(error));
        },
    });
}


interface AdminVerificationListResponse {
    success: boolean;
    data: AttorneySearchResult & { totalPages: number };
}

export function useAdminVerificationList(filters: AttorneySearchFilters & { page: number; limit: number; status: string; sortBy: string; sortOrder: string; }) {
    
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


interface AdminReviewInput {
    status: 'approved' | 'rejected';
    adminNotes?: string;
    rejectionReason?: string;
    rejectionDetails?: string;
}

export function useReviewVerification(attorneyId: string) {
    const queryClient = useQueryClient();

    return useMutation<AuthResponse, unknown, AdminReviewInput>({
        mutationFn: async (data) => {
            const response = await apiClient.put<AuthResponse>(`/admin/attorneys/${attorneyId}/verification/review`, data);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Verification status updated successfully!');
            // Invalidate the list and the specific attorney's details
            queryClient.invalidateQueries({ queryKey: ['adminVerificationList'] });
            queryClient.invalidateQueries({ queryKey: ['attorneyDetails', attorneyId] });
        },
        onError: (error) => {
            toast.error(handleApiError(error));
        },
    });
}