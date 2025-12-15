// src/utils/booking-utils.ts

import type { ConsultationMode } from '@/types'; // Import your frontend type

// Define the precise type expected by the API
export type ApiConsultationMode = 'video_call' | 'audio_call' | 'in_person' | 'chat'; 

/**
 * Converts human-readable ConsultationMode to the snake_case API format.
 * @param mode The human-readable mode from the form.
 * @returns The API-compatible mode string.
 */
export const toApiConsultationMode = (mode: ConsultationMode): ApiConsultationMode => {
    switch (mode) {
        case 'Video Call':
            return 'video_call';
        case 'Phone Call':
            return 'audio_call'; // Assuming 'Phone Call' maps to 'audio_call' in the API
        case 'In-Person':
            return 'in_person';
        case 'chat':
            return 'chat';
        default:
            // This case should ideally not be reached if the frontend type is strict
            console.error("Unknown consultation mode:", mode);
            return 'audio_call'; 
    }
};