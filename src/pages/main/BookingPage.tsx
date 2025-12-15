import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// CRITICAL IMPORTS
import { useCreateBooking } from '@/hooks/booking/use-booking-management'; 
import { handleApiError } from '@/lib/api-client';
import { toast } from 'react-hot-toast'; 

// Component Imports
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Select from '@/components/common/Select'; 

// 🛑 CRITICAL FIX: Update ALL type imports to point to their correct consolidated location
import type { ApiError, ConsultationMode } from '@/types/index'; // Assuming ALL types are now here


// 1. Define Form Schema (based on HTML input and select values)
interface BookingFormData {
    bookingDate: string; 
    duration: string; 
    consultationTopic: string;
    consultationMode: ConsultationMode; 
}

// Options for the duration select field
const durationOptions = [
    { value: '30', label: '30 Minutes' },
    { value: '60', label: '60 Minutes' },
    { value: '90', label: '90 Minutes' },
];

// Options for the consultation mode select field
const modeOptions = [
    { value: 'video_call', label: 'Video Call' },
    { value: 'audio_call', label: 'Audio Call' },
];


export default function BookingPage() {
// Cast the result of useParams for better type safety
const { id: attorneyId } = useParams<{ id: string }>();
const navigate = useNavigate();

 // Ensure attorneyId is available before passing to the hook
const { mutate: createBooking, isPending } = useCreateBooking(attorneyId || '');

// Initialize form
const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>({
 defaultValues: {
 duration: '60', // Default duration as string
 consultationMode: 'video_call',
            bookingDate: '',
            consultationTopic: '',
 }
});

// Submission Handler
const onSubmit = (data: BookingFormData) => {
 if (!attorneyId) return toast.error('Attorney ID is missing.');

 // Convert HTML datetime-local string to ISO 8601 string required by the API
const bookingDateTime = new Date(data.bookingDate).toISOString(); 
        
        // Convert duration string to number for the API payload
        const durationNumber = parseInt(data.duration);
        
 createBooking(
{
bookingDate: bookingDateTime,
duration: durationNumber, 
consultationTopic: data.consultationTopic,
bookingType: 'consultation', // Fixed value for this form
consultationMode: data.consultationMode,
description: "Initial request from client."
},
{
onSuccess: (res) => {

                    // FIX 1: Accessing res.data?.bookingNumber is now correctly typed 
                    // assuming the type in use-booking-management.ts was updated.
                    const bookingNumber = res.data?.bookingNumber;
                    
                    // FIX 2: Use nullish coalescing to ensure a string is passed to toast.success
 toast.success(res.message ?? 'Booking request sent successfully!');

 // Redirect to the newly created booking details page
 if (bookingNumber) {
                        // Assuming the booking details route uses the bookingNumber as the ID
                        navigate(`/bookings/${bookingNumber}`);
                    } else {
                        // Fallback if the booking number is missing (should not happen if API is correct)
                        navigate('/dashboard'); 
                    }
},
onError: (error) => {
// Cast error to ApiError for robust error message extraction
toast.error(handleApiError(error as ApiError));
}
}
 );
};

 return (
<div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">
                Book Consultation with Attorney <span className='text-primary-600'>{attorneyId}</span>
            </h1>

<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg bg-white p-6 rounded-lg shadow-lg border border-gray-100">
<Input
label="Preferred Date and Time"
type="datetime-local"
 {...register('bookingDate', { required: 'Booking date is required' })}
 error={errors.bookingDate?.message}
                    min={new Date().toISOString().slice(0, 16)} // Prevent booking in the past
 />

<Input
label="Consultation Topic"
 type="text"
{...register('consultationTopic', { required: 'Topic is required' })}
 error={errors.consultationTopic?.message}
/>

                {/* Duration Field */}
                <Select
                    label="Duration"
                    options={durationOptions}
                    {...register('duration', { required: 'Duration is required' })}
                    error={errors.duration?.message}
                />

                {/* Consultation Mode Field */}
                <Select
                    label="Consultation Mode"
                    options={modeOptions}
                    {...register('consultationMode', { required: 'Mode is required' })}
                    error={errors.consultationMode?.message}
                />

 <Button type="submit" disabled={isPending} className="w-full">
 {isPending ? 'Requesting...' : 'Submit Booking Request'}
</Button>
</form>
</div>
);
}