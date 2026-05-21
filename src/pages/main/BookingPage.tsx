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
import Layout from '@/components/layout/Layout';

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
    { value: '30', label: '30 minutes' },
    { value: '60', label: '60 minutes' },
    { value: '90', label: '90 minutes' },
];

// Options for the consultation mode select field
const modeOptions = [
    { value: 'Video Call' as ConsultationMode, label: 'Video call' },
    { value: 'Phone Call' as ConsultationMode, label: 'Phone call' },
    { value: 'In-Person' as ConsultationMode, label: 'In-person meeting' },
];


export default function BookingPage() {
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
            duration: '60',
            consultationMode: 'Video Call',
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
        const apiMode = toApiConsultationMode(data.consultationMode); 

        // 2. Call the mutation hook
        createBooking(
            {
                bookingDate: bookingDateTime,
                duration: durationNumber, 
                consultationTopic: data.consultationTopic,
                bookingType: 'consultation',
                consultationMode: apiMode,
                description: "Initial request from client."
            },
            {
                onSuccess: (res) => {
                    toast.success(res.message ?? 'Booking request sent successfully!');

                    // Redirect to MyBookingsPage
                    navigate('/my-bookings');
                },
                onError: (error) => {
                    toast.error(handleApiError(error as ApiError));
                }
            }
        );
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-12 sm:py-16">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8 sm:mb-12">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                            Book consultation
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600">
                            Schedule a consultation with your selected attorney
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
                        <Input
                            label="Preferred date and time"
                            type="datetime-local"
                            {...register('bookingDate', { required: 'Booking date is required' })}
                            error={errors.bookingDate?.message}
                            min={new Date().toISOString().slice(0, 16)}
                        />

                        <Input
                            label="Consultation topic"
                            type="text"
                            {...register('consultationTopic', { required: 'Topic is required' })}
                            error={errors.consultationTopic?.message}
                            placeholder="What do you need help with?"
                        />

                        <Select
                            label="Duration"
                            options={durationOptions}
                            {...register('duration', { required: 'Duration is required' })}
                            error={errors.duration?.message}
                        />

                        <Select
                            label="Consultation mode"
                            options={modeOptions}
                            {...register('consultationMode', { required: 'Mode is required' })}
                            error={errors.consultationMode?.message}
                        />

                        <div className="pt-4">
                            <Button 
                                type="submit" 
                                disabled={isPending} 
                                className="w-full bg-primary-600 hover:bg-primary-700"
                            >
                                {isPending ? 'Requesting...' : 'Submit booking request'}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            ← Back to attorney profile
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}