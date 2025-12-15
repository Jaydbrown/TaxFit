// src/types/booking.ts (Recommended new file)

// --- Shared Base Types ---

export type ConsultationMode = 'video_call' | 'audio_call' | 'in_person';
export type BookingType = 'consultation' | 'meeting';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';


// --- User/Attorney Snippets (Used inside Booking) ---

export interface BookingUserSnippet {
    fullName: string;
    email: string;
    phoneNumber: string;
}

export interface BookingAttorneySnippet {
    fullName: string;
    firmName: string;
    email: string;
}


// --- 1. Core Booking Structure (for GET /api/v1/bookings/{bookingId} and /my-bookings) ---

export interface Booking {
    _id: string;
    bookingNumber: string;
    user: BookingUserSnippet;
    attorney: BookingAttorneySnippet;
    bookingDate: string; // ISO 8601 Date/Time string
    duration: number; // in minutes
    status: BookingStatus;
    amount: number;
    consultationMode: ConsultationMode;
    meetingLink?: string; // Only exists if status is 'confirmed'
    consultationTopic?: string;
    description?: string;
    documents?: { name: string; url: string }[];
}


// --- 2. Request Body Type (POST /api/v1/bookings/attorney/{attorneyId}/book) ---

export interface CreateBookingInput {
    bookingDate: string; // "2024-12-25T10:00:00Z"
    duration: number;
    consultationTopic: string;
    description: string;
    documents?: { name: string; url: string }[];
    bookingType: BookingType;
    consultationMode: ConsultationMode;
}


// --- 3. Response Structure Types ---

export interface PaginatedResponse {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface BookingsListResponseData {
    bookings: Booking[];
    pagination: PaginatedResponse;
    stats?: {
        totalBookings: number;
        pendingBookings: number;
        confirmedBookings: number;
        completedBookings: number;
        totalEarnings: number;
    };
}

/**
 * Response structure for the booking creation endpoint (201 response).
 */
export interface CreateBookingSuccessData {
    bookingNumber: string;
    attorneyName: string;
    bookingDate: string;
    duration: number;
    amount: number;
    status: BookingStatus;
    requiresPayment: boolean;
}