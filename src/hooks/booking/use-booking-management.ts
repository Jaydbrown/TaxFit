// src/hooks/booking/use-booking-management.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient, { handleApiError } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
// CRITICAL: Ensure ApiResponse is imported alongside AuthResponse and ApiError
import type { AuthResponse, ApiError, ApiResponse } from '@/types'; 
import type { Booking, PaginatedResponse } from '@/types/booking'; 

// --- Type Definitions for API Interaction ---

// Use the full Booking object from the API example
interface BookingDetailResponse extends AuthResponse {
    data: Booking;
}

// Type for the list response
interface BookingsListResponse extends AuthResponse {
    data: {
        bookings: Booking[];
        pagination: PaginatedResponse;
        stats?: { [key: string]: number | string }; // For attorney stats
    };
}

// Type for the initial booking request payload
interface CreateBookingInput {
    attorneyId: string;
    bookingDate: string; // ISO 8601 DateTime
    duration: number; // in minutes
    consultationTopic: string;
    description: string;
    documents?: { name: string; url: string }[];
    bookingType: 'consultation' | 'meeting'; // Example values
    consultationMode: 'video_call' | 'audio_call' | 'in_person'; // Example values
}

// Type for the booking status query filter
type BookingStatus = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';


// ====================================================================
// A. CREATE/REQUEST BOOKING (Mutation)
// ====================================================================

/**
 * Hook to request a new booking with a specific attorney.
 * POST /api/v1/bookings/attorney/{attorneyId}/book
 */
export function useCreateBooking(attorneyId: string) {
    const queryClient = useQueryClient();

    return useMutation<AuthResponse, ApiError, Omit<CreateBookingInput, 'attorneyId'>>({
        mutationKey: ['createBooking', attorneyId],

        mutationFn: async (data) => {
            const response = await apiClient.post<AuthResponse>(`/bookings/attorney/${attorneyId}/book`, data);
            return response.data;
        },

        onSuccess: (data) => {
            toast.success(data.message || 'Booking request submitted successfully!');
            queryClient.invalidateQueries({ queryKey: ['my-bookings'] }); // Refresh user's booking list
        },
        onError: (error) => {
            toast.error(handleApiError(error) ?? 'Failed to submit booking request.');
        },
    });
}


// ====================================================================
// B. GET USER'S BOOKINGS (Query)
// ====================================================================

/**
 * Hook to retrieve a list of all bookings for the authenticated user.
 * GET /api/v1/bookings/my-bookings
 */
export function useUserBookings(status: BookingStatus = 'all', page: number = 1, limit: number = 10) {
    return useQuery<BookingsListResponse['data']['bookings'], ApiError>({
        queryKey: ['my-bookings', status, page, limit],
        queryFn: async () => {
            const params = { status, page, limit };
            const response = await apiClient.get<BookingsListResponse>('/bookings/my-bookings', { params });
            return response.data.data.bookings;
        },
        staleTime: 5 * 60 * 1000,
    });
}


// ====================================================================
// C. GET SINGLE BOOKING DETAILS (Query)
// ====================================================================

/**
 * Hook to retrieve detailed information about a specific booking.
 * GET /api/v1/bookings/{bookingId}
 */
export function useBookingDetails(bookingId: string) {
    const isEnabled = !!bookingId;
    return useQuery<BookingDetailResponse['data'], ApiError>({
        queryKey: ['bookingDetails', bookingId],
        queryFn: async () => {
            const response = await apiClient.get<BookingDetailResponse>(`/bookings/${bookingId}`);
            return response.data.data;
        },
        enabled: isEnabled,
        staleTime: 5 * 60 * 1000,
    });
}


// ====================================================================
// D. CANCEL BOOKING (Mutation)
// ====================================================================

interface CancelBookingInput {
    bookingId: string;
    cancellationReason: string;
}

/**
 * Hook to handle the cancellation of a booking by the user.
 * PUT /api/v1/bookings/{bookingId}/cancel
 */
export function useCancelBooking() {
    const queryClient = useQueryClient();

    return useMutation<AuthResponse, ApiError, CancelBookingInput>({
        mutationKey: ['cancelBooking'],
        mutationFn: async ({ bookingId, cancellationReason }) => {
            const response = await apiClient.put<AuthResponse>(`/bookings/${bookingId}/cancel`, { cancellationReason });
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Booking successfully cancelled.');
            queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
            queryClient.invalidateQueries({ queryKey: ['bookingDetails'] });
        },
        onError: (error) => {
            toast.error(handleApiError(error) ?? 'Failed to cancel booking.');
        },
    });
}


// ====================================================================
// E. PROCESS PAYMENT (Mutation)
// ====================================================================

interface ProcessPaymentInput {
    bookingId: string;
    paymentMethod: string;
    cardDetails: { [key: string]: string }; // Example for card details
}

/**
 * Hook to process payment for a confirmed booking.
 * POST /api/v1/bookings/{bookingId}/payment
 */
export function useProcessPayment() {
    const queryClient = useQueryClient();

    return useMutation<AuthResponse, ApiError, ProcessPaymentInput>({
        mutationKey: ['processPayment'],
        mutationFn: async ({ bookingId, ...paymentData }) => {
            const response = await apiClient.post<AuthResponse>(`/bookings/${bookingId}/payment`, paymentData);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Payment successfully processed.');
            queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
            queryClient.invalidateQueries({ queryKey: ['bookingDetails'] });
        },
        onError: (error) => {
            toast.error(handleApiError(error) ?? 'Payment failed.');
        },
    });
} 

// ====================================================================
// F. SUBMIT REVIEW (Mutation)
// ====================================================================

export interface SubmitReviewInput {
    bookingId: string;
    rating: number; // 1 to 5
    comment: string;
}

// FIX: Using ApiResponse<void> to represent a successful submission with no specific data payload.
type SubmitReviewResponse = ApiResponse<void>; 

/**
 * Mutation hook for submitting a review after a consultation is completed.
 * POST /api/v1/reviews/booking/:bookingId
 */
export function useSubmitReview() {
    const queryClient = useQueryClient();

    return useMutation<SubmitReviewResponse, ApiError, SubmitReviewInput>({
        mutationKey: ['submitReview'],
        
        mutationFn: async (input) => {
            const response = await apiClient.post<SubmitReviewResponse>(
                `/reviews/booking/${input.bookingId}`, 
                { 
                    rating: input.rating, 
                    comment: input.comment 
                }
            );
            return response.data;
        },

        onSuccess: (data) => {
            toast.success(data?.message || "Review submitted successfully!");
            // Invalidate the booking details query so the review status updates instantly
            queryClient.invalidateQueries({ queryKey: ['bookingDetails'] });
        },
        onError: (error) => {
            toast.error(handleApiError(error) ?? "Failed to submit review.");
        }
    });
}