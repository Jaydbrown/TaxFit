import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { handleApiError } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';

import type { 
    AuthResponse, 
    ProfileUpdateInput, // This type must now include education/certifications arrays
    Attorney,
    User
} from '@/types'; 
// Assuming AttorneyDetailsResponse is imported from use-verification or defined locally
interface AttorneyDetailsResponse {
    success: boolean;
    data: Attorney;
}



export function useUpdateProfile() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const isAttorney = user?.userType === 'attorney';

    const updateGeneralProfile = (data: ProfileUpdateInput) => 
        apiClient.put<AuthResponse>('/auth/profile', {
            fullName: data.fullName,
            phoneNumber: data.phoneNumber,
            avatarUrl: data.avatarUrl,
        });

    const updateAttorneyProfile = (data: ProfileUpdateInput) => 
        apiClient.put<AuthResponse>('/attorney/profile', {
            firmName: data.firmName,
            bio: data.bio,
            hourlyRate: data.hourlyRate,
            specializations: data.specializations,
            
            // --- FIX: ADDED NEW COMPLEX FIELDS ---
            education: data.education, 
            certifications: data.certifications,
            // ------------------------------------
        });

    return useMutation<AuthResponse, unknown, ProfileUpdateInput>({
        mutationFn: async (data) => {
            let message = '';
            
            // 1. Update General User Fields (for both roles)
            const generalRes = await updateGeneralProfile(data);
            message = generalRes.data.message || 'Profile updated successfully.';
            
            // 2. Update Attorney-Specific Fields if applicable
            if (isAttorney) {
                // Ensure attorney-specific data is present before calling the attorney endpoint
                if (data.firmName || data.bio || data.hourlyRate || data.education || data.certifications) {
                    const attorneyRes = await updateAttorneyProfile(data);
                    message = attorneyRes.data.message || 'Profile and Attorney details updated successfully.';
                }
            }
            
            return { success: true, message: message, data: generalRes.data.data }; // Return structured response
        },
        onSuccess: (data) => {
            toast.success(data.message ?? 'Profile updated successfully.');
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
        onError: (error) => {
            toast.error(handleApiError(error) ?? 'Failed to update user profile.');
        },
    });
}


export function useAttorneyDetails(attorneyId: string) {
    const isEnabled = !!attorneyId;
    
    return useQuery<AttorneyDetailsResponse['data'], unknown>({
        queryKey: ['attorneyDetails', attorneyId],
        queryFn: async () => {
            const response = await apiClient.get<AttorneyDetailsResponse>(`/api/v1/attorney/profile/${attorneyId}`); 
            return response.data.data;
        },
        enabled: isEnabled,
        staleTime: 10 * 60 * 1000, 
    });
}


export function useToggleAvailability() {
    const queryClient = useQueryClient();
    
    return useMutation<AuthResponse, unknown, void>({
        mutationFn: async () => {
            const response = await apiClient.put<AuthResponse>('/attorney/toggle-availability');
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Availability updated.');
            queryClient.invalidateQueries({ queryKey: ['profile'] }); 
        },
        onError: (error) => {
            toast.error(handleApiError(error) ?? 'Failed to toggle availability status.');
        },
    });
}

