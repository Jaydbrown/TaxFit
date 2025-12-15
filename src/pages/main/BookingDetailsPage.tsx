// src/pages/main/BookingDetailsPage.tsx

import React from 'react';
import { useParams } from 'react-router-dom';
import { useBookingDetails } from '@/hooks/booking/use-booking-management';
import { AlertTriangle, Info } from 'lucide-react'; // Use standard icons for warnings

import Layout from '@/components/layout/Layout'; 
import { LoadingSpinner } from '@/components/common/Spinner';
import Card from '@/components/common/Card';
import BookingActionPanel from '@/components/bookings/BookingActionPanel'; 

// --- SIMPLE INLINE ERROR/INFO STATE COMPONENTS ---
// Replaces ErrorState component to avoid dependency errors.

const InfoMessage: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <Card className="p-6 border-l-4 border-blue-500 bg-blue-50">
        <div className="flex items-center space-x-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
                <h3 className="font-semibold text-blue-800">{title}</h3>
                <p className="text-sm text-blue-700 mt-1">{description}</p>
            </div>
        </div>
    </Card>
);

const ErrorMessage: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <Card className="p-6 border-l-4 border-red-500 bg-red-50">
        <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
                <h3 className="font-semibold text-red-800">{title}</h3>
                <p className="text-sm text-red-700 mt-1">{description}</p>
            </div>
        </div>
    </Card>
);
// -------------------------------------------------


export default function BookingDetailsPage() {
    // 1. Get the bookingId from the URL parameter
    const { bookingId } = useParams<{ bookingId: string }>();

    // 2. Fetch the booking data using the hook
    const { 
        data: booking, 
        isLoading, 
        isError, 
        error 
    } = useBookingDetails(bookingId || '');

    // --- Loading and Error States ---

    if (!bookingId) {
        return (
            <Layout>
                <div className="container mx-auto p-6">
                    <ErrorMessage 
                        title="Missing Booking ID" 
                        description="The booking ID is missing from the URL. Please check the link." 
                    />
                </div>
            </Layout>
        );
    }
    
    if (isLoading) {
        return (
            <Layout className="flex justify-center items-center h-full">
                <LoadingSpinner message={`Fetching details for Booking #${bookingId}...`} />
            </Layout>
        );
    }

    if (isError) {
        return (
            <Layout>
                <div className="container mx-auto p-6">
                    <ErrorMessage 
                        title="Error Loading Booking" 
                        description={error?.message || `Could not fetch details for Booking #${bookingId}.`} 
                    />
                </div>
            </Layout>
        );
    }

    if (!booking) {
        return (
            <Layout>
                <div className="container mx-auto p-6">
                    <InfoMessage 
                        title="Booking Not Found" 
                        description={`Booking #${bookingId} does not exist or you lack permission to view it.`} 
                    />
                </div>
            </Layout>
        );
    }
    
    // --- Render Content ---
    
    return (
        <Layout>
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-extrabold mb-8 text-gray-900">
                    Consultation Details
                    <span className="text-primary-600 ml-3">#{booking.bookingNumber || bookingId}</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Column (2/3 width) */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* SIMPLIFIED CONTENT DISPLAY */}
                        <Card className="space-y-4">
                            <h2 className="text-2xl font-semibold border-b pb-2">Booking Summary</h2>
                            <p><strong>Status:</strong> <span className={`font-medium ${booking.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'}`}>{booking.status}</span></p>
                            <p><strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {new Date(booking.bookingDate).toLocaleTimeString()}</p>
                            <p><strong>Topic:</strong> {booking.consultationTopic}</p>
                            <p><strong>Mode:</strong> {booking.consultationMode}</p>
                        </Card>
                        
                        {/* Documents/Timeline Placeholder */}
                        <Card>
                            <h2 className="text-xl font-semibold mb-4">Timeline & Documents</h2>
                            <p className="text-gray-500">Document viewing and history logs will be implemented here.</p>
                        </Card>
                    </div>

                    {/* Sidebar Column (1/3 width) */}
                    <div className="lg:col-span-1">
                        {/* Correctly passes the fetched 'booking' object */}
                        <BookingActionPanel booking={booking} /> 
                    </div>
                </div>
            </div>
        </Layout>
    );
}