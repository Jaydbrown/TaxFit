// src/hooks/attorney/use-attorney-search.ts

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
// Ensure the handleApiError is imported from where you defined it in apiClient.ts
import { handleApiError } from '@/lib/api-client'; 

// Assuming these types are correctly structured and available:
import type { 
    AttorneySearchResult, 
    AttorneySearchFilters 
} from '@/types'; 


interface AttorneySearchResponse {
    success: boolean;
    data: AttorneySearchResult;
}

/**
 * Hook to fetch paginated and filtered lists of available attorneys.
 * Calls GET /book/available.
 * @param filters - The current search and filter criteria, including searchQuery, specialization, etc.
 */
export function useAttorneySearch(filters: AttorneySearchFilters) {
    
    // Default page/limit values, assumed for a search page.
    const defaultFilters = { page: 1, limit: 20, ...filters };

    // Use useQuery for data fetching (read operation)
    return useQuery<AttorneySearchResult, unknown>({
        // The query key changes when any filter parameter changes, ensuring automatic refetching.
        queryKey: ['attorneySearch', defaultFilters],
        
        queryFn: async () => {
            const response = await apiClient.get<AttorneySearchResponse>('/book/available', {
                params: defaultFilters,
            });
            
            // Return the nested data payload
            return response.data.data; 
        },
        
        staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes
    });
}