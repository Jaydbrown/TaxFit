import React, { useState } from 'react';
import { Loader2, Filter, Calendar, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import Layout from '@/components/layout/Layout';
import BookingCard from '@/components/bookings/BookingCard';
import Select from '@/components/common/Select';
import Button from '@/components/common/Button';
import Pagination from '@/components/common/Pagination'; // Assuming you have a Pagination component
import Input from '@/components/common/Input'; 

import { useUserBookings } from '@/hooks/booking/use-booking-management';
import { handleApiError } from '@/lib/api-client';
import type { Booking } from '@/types/booking'; 

// Define the type for the status filter (must match the hook/API)
type BookingStatus = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';

// Options for the status filter select field
const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending Requests' },
    { value: 'confirmed', label: 'Confirmed Consultations' },
    { value: 'completed', label: 'Completed Consultations' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'rejected', label: 'Rejected' },
];

export default function MyBookingsPage() {
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState<BookingStatus>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 9; // Fixed limit for display

    // Fetch data using the hook
    const { 
        data: bookings, 
        isLoading, 
        isError, 
        error, 
        // We'll need to update the useUserBookings hook slightly 
        // if we want to retrieve total/pagination data from the query.
    } = useUserBookings(statusFilter, currentPage, bookingsPerPage);

    // --- Temporary Pagination Data (Assuming API doesn't return full pagination) ---
    // NOTE: If your useUserBookings only returns the array, you can only fake pagination.
    // If it returns a structure { bookings: [...], pagination: {...} }, use that data.
    const mockPagination = {
        total: 50, // Placeholder
        totalPages: Math.ceil(50 / bookingsPerPage), // Placeholder
    };
    // -----------------------------------------------------------------------------

    React.useEffect(() => {
        if (isError) {
            toast.error(handleApiError(error) ?? 'Failed to load your booking list.');
        }
    }, [isError, error]);

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value as BookingStatus);
        setCurrentPage(1); // Reset page on filter change
    };
    
    // Fallback if the hook only returns an array (as currently typed)
    const bookingsArray: Booking[] = Array.isArray(bookings) ? bookings : [];

    return (
        <Layout>
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-primary-600" />
                    My Consultations
                </h1>
                <p className="text-gray-600 mb-8">
                    View and manage all your pending, confirmed, and past booking requests.
                </p>

                {/* Filter and Search Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
                    <div className="md:w-1/3 w-full">
                        <Select
                            label="Filter by Status"
                            options={statusOptions}
                            value={statusFilter}
                            onChange={handleStatusChange}
                            leftIcon={<Filter className="w-4 h-4" />}
                        />
                    </div>
                    <div className="md:w-2/3 w-full">
                         <Input
                            type="search"
                            label="Search Topic or Attorney Name (Not Implemented in Hook)"
                            placeholder="Enter keyword..."
                            leftIcon={<Search className="w-4 h-4" />}
                            // Note: Hook currently does not support search, this is UI only
                        />
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
                        <p className="text-lg text-gray-600">Fetching your consultation list...</p>
                    </div>
                )}

                {/* Error State */}
                {isError && !isLoading && (
                    <div className="text-center py-20 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xl text-red-600">Error: Could not load bookings.</p>
                        <p className="text-gray-500 mt-2">Please try reloading the page or check your network connection.</p>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !isError && bookingsArray.length === 0 && (
                    <div className="p-12 bg-white border border-dashed border-gray-300 rounded-lg text-center shadow-sm">
                        <p className="text-xl text-gray-600 mb-4">
                            You have no bookings matching the selected status: <span className='font-semibold capitalize'>{statusFilter}</span>.
                        </p>
                        <Button onClick={() => navigate('/find-attorney')} variant="primary">
                            Book Your First Consultation
                        </Button>
                    </div>
                )}

                {/* Content Grid */}
                {!isLoading && bookingsArray.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bookingsArray.map((booking: Booking) => (
                                <BookingCard key={booking._id} booking={booking} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-10 flex justify-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={mockPagination.totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
}