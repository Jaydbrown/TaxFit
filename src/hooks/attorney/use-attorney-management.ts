// src/hooks/attorney/use-attorney-management.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { handleApiError } from '@/lib/api-client';
import { toast } from 'react-hot-toast'; // 🎯 FIX 2: Import toast
import type { ApiError, ApiResponse } from '@/types'; 

// --- Type Definitions ---

export interface AttorneyDashboardStats {
    activeCases: number;
    unreadMessages: number;
    totalClients: number;
    pendingVerifications?: number;
}

// 🎯 FIX 1: Removed redundant DashboardStatsResponse interface. 
// We will use ApiResponse<AttorneyDashboardStats> directly in the hook.
// interface DashboardStatsResponse extends ApiResponse<void> {
//     data: AttorneyDashboardStats;
// } 

// NOTE: Add other required types here (e.g., for profile update)
export interface AttorneyProfileUpdateInput {
    fullName?: string;
    firmName?: string;
    // ... other profile fields
}


// ====================================================================
// A. GET ATTORNEY DASHBOARD STATS (Query)
// ====================================================================

/**
 * Hook to retrieve key statistics for the attorney dashboard.
 * GET /api/v1/attorney/dashboard-stats
 */
export function useAttorneyDashboardStats() {
    return useQuery<AttorneyDashboardStats, ApiError>({
        queryKey: ['attorneyDashboardStats'],
        queryFn: async () => {
            // 🎯 FIX 1: Use ApiResponse<AttorneyDashboardStats> directly
            const response = await apiClient.get<ApiResponse<AttorneyDashboardStats>>('/attorney/dashboard-stats');
            
            // Return the actual data payload
            return response.data.data;
        },
        staleTime: 60 * 1000, // 1 minute stale time
    });
}

// ====================================================================
// B. UPLOAD DOCUMENT (Mutation)
// ====================================================================

export function useUploadDocument() {
    const queryClient = useQueryClient();

    // Input is FormData, as it handles file uploads.
    return useMutation<ApiResponse<void>, ApiError, FormData>({
        mutationFn: async (data: FormData) => {
            const response = await apiClient.post<ApiResponse<void>>(
                '/attorney/upload-document',
                data,
                {
                    headers: {
                        // Crucial for file uploads
                        'Content-Type': 'multipart/form-data', 
                    },
                }
            );
            return response.data;
        },
        onSuccess: (response) => {
            // 🎯 FIX 2: toast is now defined
            toast.success(response.message || 'Document uploaded successfully!'); 
            // Optional: Invalidate queries if there is a list of documents on the dashboard
            // queryClient.invalidateQueries({ queryKey: ['attorneyDocuments'] });
        },
        onError: (error) => {
            // 🎯 FIX 2: toast is now defined
            toast.error(`Upload Failed: ${error?.response?.data?.message || error.message}`);
        },
    });
}