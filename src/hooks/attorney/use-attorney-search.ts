// src/hooks/attorney/use-attorney-search.ts (FIXED)

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { handleApiError } from '@/lib/api-client'; 
import type { 
    AttorneySearchResult, 
    AttorneySearchFilters 
} from '@/types'; 


interface AttorneySearchResponse {
    success: boolean;
    data: AttorneySearchResult;
}

const cleanFilters = (filters: AttorneySearchFilters) => {
    const page = Number(filters.page || 1);
    const limit = Number(filters.limit || 20);
    const cleaned: Record<string, any> = { page, limit };

    // Iterate over the rest of the filters
    Object.entries(filters).forEach(([key, value]) => {
        if (key !== 'page' && key !== 'limit' && value !== undefined && value !== null && value !== '') {
            cleaned[key] = value;
        }
    });

    return cleaned;
};


export function useAttorneySearch(filters: AttorneySearchFilters) {
    
    const cleanedFilters = cleanFilters(filters);

    return useQuery<AttorneySearchResult, unknown>({
        queryKey: ['attorneySearch', cleanedFilters],
        
        queryFn: async () => {
            const response = await apiClient.get<AttorneySearchResponse>('/bookings/available', {
                params: cleanedFilters,
            });
            
            return response.data.data; 
        },
        
        staleTime: 5 * 60 * 1000, 
    });
}