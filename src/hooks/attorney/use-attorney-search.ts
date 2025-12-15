// src/hooks/attorney/use-attorney-search.ts (FIXED)

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { handleApiError } from '@/lib/api-client'; 
import type { 
    AttorneySearchResult, 
    AttorneySearchFilters 
} from '@/types'; 
import type { AttorneySearchResultItem, GetAttorneysResponse } from '@/types/attorney';



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


export function useAttorneys() {
  return useQuery<AttorneySearchResultItem[]>({
    queryKey: ['verified-attorneys'],

    queryFn: async () => {
      const res = await apiClient.get<GetAttorneysResponse>(
        '/bookings/available'
      );

      return res.data.data;
    },

    staleTime: 5 * 60 * 1000
  });
}