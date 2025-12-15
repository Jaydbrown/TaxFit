// src/hooks/attorney/use-attorneys.ts

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import type { AttorneySearchResultItem, GetAttorneysResponse } from '@/types/attorney';

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