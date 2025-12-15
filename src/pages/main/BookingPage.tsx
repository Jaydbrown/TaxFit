import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// CRITICAL IMPORTS
import { useCreateBooking } from '@/hooks/booking/use-booking-management'; 
import { handleApiError } from '@/lib/api-client';
import { toast } from 'react-hot-toast'; 
import { toApiConsultationMode } from '@/utils/booking-utils'; // Utility to convert mode string
// Component Imports
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Select from '@/components/common/Select'; 
import Layout from '@/components/layout/Layout'; // Assuming BookingPage uses a Layout

// 🛑 CRITICAL FIX: Update ALL type imports to point to their correct consolidated location
import type { ApiError, ConsultationMode } from '@/types/index'; 


// 1. Define Form Schema (based on HTML input and select values)
interface BookingFormData {
    bookingDate: string; // HTML datetime-local string
    duration: string; // e.g., '30', '60'
    consultationTopic: string;
    consultationMode: ConsultationMode; // e.g., 'Video Call', 'In-Person'
}

// Options for the duration select field
const durationOptions = [
    { value: '30', label: '30 Minutes' },
    { value: '60', label: '60 Minutes' },
    { value: '90', label: '90 Minutes' },
];

// Options for the consultation mode select field
// 🎯 FIX: Values must match the string literals in the ConsultationMode type (e.g., 'Video Call')
// The conversion to API snake_case happens only in the onSubmit handler.
const modeOptions = [
    // Assuming 'Video Call' and 'Phone Call' are the accepted ConsultationMode strings from your type definition
    { value: 'Video Call' as ConsultationMode, label: 'Video Call' },
    { value: 'Phone Call' as ConsultationMode, label: 'Phone Call (Audio)' },
    { value: 'In-Person' as ConsultationMode, label: 'In-Person Meeting' },
];


export default function BookingPage() {
    // Cast the result of useParams for better type safety
    const { id: attorneyId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Ensure attorneyId is available before passing to the hook
    const { mutate: createBooking, isPending } = useCreateBooking(attorneyId || '');

    // Initialize form
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm<BookingFormData>({
        defaultValues: {
            duration: '60', // Default duration as string
            consultationMode: 'Video Call', // Default must be a string from ConsultationMode
            bookingDate: '',
            consultationTopic: '',
        }
    });

    // Submission Handler
    const onSubmit = (data: BookingFormData) => {
        if (!attorneyId) return toast.error('Attorney ID is missing.');

        // 1. Prepare data and perform conversions
        const bookingDateTime = new Date(data.bookingDate).toISOString();
        const durationNumber = parseInt(data.duration, 10);
        
        // 🎯 FIX: Conversion logic moved INSIDE onSubmit handler where 'data' is in scope
        const apiMode = toApiConsultationMode(data.consultationMode); 

        // 2. Call the mutation hook
        createBooking(
            {
                // Fields required by CreateBookingInput (assuming the hook expects this shape)
                bookingDate: bookingDateTime,
                duration: durationNumber, 
                consultationTopic: data.consultationTopic,
                bookingType: 'consultation',
                consultationMode: apiMode, // ✅ NOW USES THE CONVERTED API MODE
                description: "Initial request from client."
            },
            {
                onSuccess: (res) => {
                    // Assuming res.data contains { bookingNumber: string, ... }
                    const bookingNumber = res.data?.bookingNumber;
                    
                    toast.success(res.message ?? 'Booking request sent successfully!');

                    // Redirect to the newly created booking details page
                    if (bookingNumber) {
                        navigate(`/bookings/${bookingNumber}`);
                    } else {
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
        <Layout> {/* Wrapping content in Layout for consistency */}
            <div className="container mx-auto p-8">
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
        </Layout>
    );
}