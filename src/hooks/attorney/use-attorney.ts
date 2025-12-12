import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import apiClient from '@/lib/api-client';
import {
  Attorney,
  AttorneySearchFilters,
  AttorneySearchResult,
} from '@/types';

export const useSearchAttorneys = (filters: AttorneySearchFilters) => {
  return useQuery({
    queryKey: ['attorneys', 'search', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get<AttorneySearchResult>(
        `/attorneys/search?${params.toString()}`
      );
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useAttorneyById = (attorneyId: string) => {
  return useQuery({
    queryKey: ['attorney', attorneyId],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: Attorney }>(
        `/attorneys/${attorneyId}`
      );
      return response.data.data;
    },
    enabled: !!attorneyId,
    staleTime: 5 * 60 * 1000,
  });
};


export const useBookConsultation = () => {
  return useMutation({
    mutationFn: async (bookingData: {
      attorneyId: string;
      planId: string;
      date: string;
      time: string;
      notes?: string;
    }) => {
      const response = await apiClient.post('/consultations/book', bookingData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Consultation booked successfully!');
    },
  });
};