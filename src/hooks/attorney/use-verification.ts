import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient, { handleApiError } from '@/lib/api-client';
import { toast } from 'react-hot-toast';

import type { AttorneySearchFilters, AuthResponse } from '@/types';

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

// ✅ FIXED: Match actual API response structure
interface AdminVerificationListResponse {
    success: boolean;
    data: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        attorneys: Array<{
            id?: string;            // Some endpoints use 'id'
            _id?: string;           // Some endpoints use '_id'
            fullName?: string;      // Direct on list endpoint
            email?: string;         // Direct on list endpoint
            phoneNumber?: string;   // Direct on list endpoint
            user?: {                // Nested on details endpoint
                fullName: string;
                email: string;
                phoneNumber: string;
            };
            firmName: string;
            verificationStatus: string;
            submittedForVerificationAt?: string;
            isVerifiedAttorney: boolean;
            professionalDocuments: Array<{
                documentType: string;
                documentUrl: string;
                uploadedAt: string;
            }>;
            hourlyRate: number;
            yearsOfExperience: number;
        }>;
    };
}

interface AdminReviewInput {
    status: 'approved' | 'rejected';
    adminNotes?: string;
    rejectionReason?: string;
    rejectionDetails?: string;
}

// Details endpoint response with nested user object
interface AttorneyDetailsResponse {
    success: boolean;
    data: {
        _id: string;
        user: {
            fullName: string;
            email: string;
            phoneNumber: string;
        };
        firmName: string;
        verificationStatus: string;
        submittedForVerificationAt?: string;
        isVerifiedAttorney: boolean;
        professionalDocuments: Array<{
            documentType: string;
            documentUrl: string;
            uploadedAt: string;
            verified?: boolean;
        }>;
        hourlyRate: number;
        yearsOfExperience: number;
        bio?: string;
        specializations?: string[];
        location?: string;
        state?: string;
    };
}

// ✅ FIXED: Properly handle API response structure with better error handling
export function useAdminVerificationList(filters: AttorneySearchFilters & { 
    page: number; 
    limit: number; 
    status?: string; 
    sortBy?: string; 
    sortOrder?: string; 
    search?: string; 
}) {
    // Remove empty search parameter to avoid backend issues
    const cleanFilters = { ...filters };
    if (cleanFilters.search === '') {
        delete cleanFilters.search;
    }
    
    // If status is 'all', remove it from params (backend might not handle 'all')
    if (cleanFilters.status === 'all') {
        delete cleanFilters.status;
    }
    
    return useQuery<AdminVerificationListResponse['data'], any>({
        queryKey: ['adminVerificationList', cleanFilters],
        queryFn: async () => {
            const response = await apiClient.get<AdminVerificationListResponse>(
                '/admin/attorneys/verification',
                { params: cleanFilters }
            );
            return response.data.data;
        },
        staleTime: 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
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
            queryClient.invalidateQueries({ queryKey: ['attorneyVerificationStatus'] });
            toast.success('Verification request submitted!');
        },
        onError: (error) => {
            toast.error(handleApiError(error) ?? 'Verification submission failed.');
        },
    });
}

export function useUploadDocument() {
    return useMutation<AuthResponse, unknown, FormData>({
        mutationFn: async (formData) => {
            const response = await apiClient.post<AuthResponse>('/attorney/upload-document', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onError: (error) => {
            toast.error(handleApiError(error) ?? 'Document upload failed.');
        },
    });
}

export function useAdminAttorneyDetails(attorneyId: string, options?: { enabled?: boolean }) {
    const isEnabled = options?.enabled !== false && !!attorneyId;
    
    return useQuery<AttorneyDetailsResponse['data'], unknown>({
        queryKey: ['attorneyDetails', attorneyId],
        queryFn: async () => {
            const response = await apiClient.get<AttorneyDetailsResponse>(
                `/admin/attorneys/${attorneyId}/verification`
            );
            return response.data.data;
        },
        enabled: isEnabled,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
}

export function useReviewVerification() {
    const queryClient = useQueryClient();

    return useMutation<AuthResponse, unknown, { attorneyId: string, data: AdminReviewInput }>({
        mutationFn: async ({ attorneyId, data }) => {
            const response = await apiClient.put<AuthResponse>(
                `/admin/attorneys/${attorneyId}/verification/review`,
                data
            );
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
        staleTime: 30 * 1000,
    });
}