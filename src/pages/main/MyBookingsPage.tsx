// src/pages/main/MyBookingsPage.tsx

import React, { useState, useMemo } from 'react';
// Note: We only need useNavigate from 'react-router-dom', Navigate is optional
import { useNavigate, Link } from 'react-router-dom'; 
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
// FIX: SearchBar is a component, but the icon should be 'Search' from lucide-react
import { Calendar, Clock, User, Hash, Filter, ChevronRight, Loader2, ListOrdered, XCircle, Search } from 'lucide-react'; 
import { formatDate } from '@/utils/helpers';
import { useUserBookings, Booking } from '@/hooks/booking/use-user-bookings'; 

// --- Helper Functions and Components ---

// Map status to a visual badge
const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
        case 'Confirmed':
            return <Badge variant="success">Confirmed</Badge>;
        case 'Pending':
            return <Badge variant="warning">Pending</Badge>;
        case 'Canceled':
            return <Badge variant="danger">Canceled</Badge>;
        case 'Completed':
            return <Badge variant="neutral">Completed</Badge>;
        default:
            return <Badge variant="neutral">Draft</Badge>;
    }
};

const statusOptions = [
    { value: 'All', label: 'All Statuses' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Canceled', label: 'Canceled' },
];

// --- Booking Card Component ---

const BookingCard: React.FC<{ booking: Booking }> = ({ booking }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/bookings/${booking.bookingNumber}`);
    };

    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
            
            {/* Booking Details */}
            <div className="flex-1 space-y-3 mb-4 md:mb-0">
                <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-gray-900">{booking.serviceType}</h3>
                    {getStatusBadge(booking.status)}
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary-500" />
                        Attorney: <Link to={`/attorney/${booking.attorneyId}`} className='font-medium hover:underline'>{booking.attorneyName}</Link>
                    </span>
                    <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        Date: {formatDate(booking.date)}
                    </span>
                    <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        Time: {booking.time}
                    </span>
                    <span className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-gray-500" />
                        Ref: {booking.bookingNumber}
                    </span>
                </div>
            </div>

            {/* Action Button */}
            <div className="flex-shrink-0">
                <Button 
                    variant="outline" 
                    onClick={handleViewDetails} 
                    rightIcon={<ChevronRight className='w-4 h-4' />}
                    className='min-w-[150px]'
                >
                    View Details
                </Button>
            </div>
        </Card>
    );
};

// --- Main Page Component ---

export default function MyBookingsPage() {
    // 🎯 FIX: Initialize useNavigate here so it's available for the Button onClick handler
    const navigate = useNavigate(); 
    
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const { data: bookings, isLoading, isError, refetch } = useUserBookings();

    const filteredBookings = useMemo(() => {
        if (!bookings) return [];

        let filtered = bookings;

        // 1. Filter by Status
        if (filterStatus !== 'All') {
            filtered = filtered.filter(b => b.status === filterStatus);
        }

        // 2. Filter by Search Query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(b => 
                b.attorneyName.toLowerCase().includes(query) ||
                b.serviceType.toLowerCase().includes(query) ||
                b.bookingNumber.toLowerCase().includes(query)
            );
        }

        // Sort by date (upcoming first)
        return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [bookings, filterStatus, searchQuery]);


    // --- Render Content based on state ---
    let content;

    if (isLoading) {
        content = (
            <div className="text-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
                <p className="text-lg text-gray-600">Loading your consultation bookings...</p>
            </div>
        );
    } else if (isError) {
        content = (
            <div className="text-center py-20 text-red-600 bg-red-50 border border-red-200 rounded-lg">
                <XCircle className="w-8 h-8 mx-auto mb-4" />
                <p className="text-xl mb-2">Failed to load your booking history.</p>
                <Button onClick={() => refetch()} variant="primary" className="mt-4">Retry Loading</Button>
            </div>
        );
    } else if (filteredBookings.length === 0) {
        content = (
            <div className="text-center py-20 text-gray-500 border border-dashed rounded-lg bg-white">
                <p className="text-xl font-medium mb-2">No Bookings Found</p>
                <p>You have no current or past consultations matching the filters.</p>
                <Button variant="primary" className="mt-6" onClick={() => navigate('/find-attorney')}>
                    Book a New Consultation
                </Button>
            </div>
        );
    } else {
        content = (
            <div className="space-y-6">
                {filteredBookings.map(booking => (
                    <BookingCard key={booking.id} booking={booking} />
                ))}
            </div>
        );
    }


    return (
        <Layout>
            <div className="container mx-auto px-6 py-10 min-h-screen bg-gray-50">
                <header className="mb-10 border-b border-gray-200 pb-5">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
                        <ListOrdered className="w-8 h-8 text-primary-600" />
                        My Bookings
                    </h1>
                    <p className="text-lg text-gray-600 mt-2">View and manage all your scheduled and completed consultations.</p>
                </header>

                <Card className="mb-8 p-5">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="w-full md:w-3/5">
                            <Input
                                type="text"
                                label="Search by Attorney or Service"
                                placeholder="Search attorney name or service type..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                // FIX: Replace SearchBar component placeholder with imported Search icon
                                leftIcon={<Search className="w-4 h-4" />} 
                            />
                        </div>
                        <div className="w-full md:w-1/4">
                            <Select
                                label="Filter by Status"
                                options={statusOptions}
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                leftIcon={<Filter className="w-4 h-4" />}
                            />
                        </div>
                        <div className="w-full md:w-auto">
                            <Button 
                                variant='outline' 
                                className="w-full md:w-auto" 
                                onClick={() => {
                                    setFilterStatus('All');
                                    setSearchQuery('');
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </Card>

                {content}

            </div>
        </Layout>
    );
}