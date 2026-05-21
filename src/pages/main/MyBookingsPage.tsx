// src/pages/main/MyBookingsPage.tsx

import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { Calendar, Clock, User, Hash, Filter, ChevronRight, Loader2, ListOrdered, XCircle, Search, RefreshCw } from 'lucide-react'; 
import { formatDate } from '@/utils/helpers';
import { useUserBookings, type Booking } from '@/hooks/booking/use-user-bookings'; 

// --- Helper Functions ---

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
    { value: 'All', label: 'All statuses' },
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
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-4 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            
            {/* Booking Details */}
            <div className="flex-1 space-y-3 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">{booking.serviceType}</h3>
                    {getStatusBadge(booking.status)}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary-500 flex-shrink-0" />
                        <Link 
                            to={`/attorney/${booking.attorneyId}`} 
                            className='font-medium hover:text-primary-600 hover:underline truncate'
                        >
                            {booking.attorneyName}
                        </Link>
                    </span>
                    <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="truncate">{formatDate(booking.date)}</span>
                    </span>
                    <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="truncate">{booking.time}</span>
                    </span>
                    <span className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="truncate font-mono text-xs">{booking.bookingNumber}</span>
                    </span>
                </div>
            </div>

            {/* Action Button */}
            <div className="flex-shrink-0 w-full md:w-auto">
                <Button 
                    variant="outline" 
                    onClick={handleViewDetails} 
                    rightIcon={<ChevronRight className='w-4 h-4' />}
                    className='w-full md:min-w-[150px]'
                >
                    View details
                </Button>
            </div>
        </Card>
    );
};

// --- Main Page Component ---

export default function MyBookingsPage() {
    const navigate = useNavigate(); 
    
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch live data from backend
    const { data: bookings, isLoading, isError, refetch, isFetching } = useUserBookings();

    // Filter and sort bookings
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

        // Sort by date (upcoming first, then past)
        return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [bookings, filterStatus, searchQuery]);

    // Get stats
    const stats = useMemo(() => {
        if (!bookings) return { total: 0, pending: 0, confirmed: 0, completed: 0 };
        
        return {
            total: bookings.length,
            pending: bookings.filter(b => b.status === 'Pending').length,
            confirmed: bookings.filter(b => b.status === 'Confirmed').length,
            completed: bookings.filter(b => b.status === 'Completed').length,
        };
    }, [bookings]);

    // --- Render Content based on state ---
    let content;

    if (isLoading) {
        content = (
            <div className="text-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
                <p className="text-lg text-gray-600">Loading your bookings...</p>
            </div>
        );
    } else if (isError) {
        content = (
            <div className="text-center py-20 text-red-600 bg-red-50 border border-red-200 rounded-lg">
                <XCircle className="w-8 h-8 mx-auto mb-4" />
                <p className="text-xl mb-2">Failed to load your bookings</p>
                <p className="text-sm text-gray-600 mb-4">Please check your connection and try again</p>
                <Button onClick={() => refetch()} variant="primary" className="mt-4">
                    Retry
                </Button>
            </div>
        );
    } else if (!bookings || bookings.length === 0) {
        content = (
            <div className="text-center py-20 text-gray-500 border border-dashed rounded-lg bg-white">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl font-semibold mb-2">No bookings yet</p>
                <p className="text-gray-600 mb-6">Start by booking a consultation with a tax attorney</p>
                <Button variant="primary" className="mt-6" onClick={() => navigate('/find-attorney')}>
                    Find attorney
                </Button>
            </div>
        );
    } else if (filteredBookings.length === 0) {
        content = (
            <div className="text-center py-20 text-gray-500 border border-dashed rounded-lg bg-white">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl font-semibold mb-2">No bookings found</p>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search</p>
                <Button 
                    variant="outline" 
                    onClick={() => {
                        setFilterStatus('All');
                        setSearchQuery('');
                    }}
                >
                    Clear filters
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
            <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-8 sm:py-10 min-h-screen bg-gray-50">
                
                {/* Header */}
                <header className="mb-8 sm:mb-10 border-b border-gray-200 pb-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
                                <ListOrdered className="w-8 h-8 text-primary-600" />
                                My bookings
                            </h1>
                            <p className="text-base sm:text-lg text-gray-600 mt-2">
                                View and manage your scheduled consultations
                            </p>
                        </div>
                        
                        {/* Refresh Button */}
                        <Button
                            variant="outline"
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className="w-full sm:w-auto"
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                            {isFetching ? 'Refreshing...' : 'Refresh'}
                        </Button>
                    </div>
                </header>

                {/* Stats Cards */}
                {bookings && bookings.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <Card className="p-4 text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</div>
                            <div className="text-sm text-gray-600">Total bookings</div>
                        </Card>
                        <Card className="p-4 text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-yellow-600">{stats.pending}</div>
                            <div className="text-sm text-gray-600">Pending</div>
                        </Card>
                        <Card className="p-4 text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-green-600">{stats.confirmed}</div>
                            <div className="text-sm text-gray-600">Confirmed</div>
                        </Card>
                        <Card className="p-4 text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-gray-600">{stats.completed}</div>
                            <div className="text-sm text-gray-600">Completed</div>
                        </Card>
                    </div>
                )}

                {/* Filters */}
                <Card className="mb-8 p-4 sm:p-5">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="w-full md:w-3/5">
                            <Input
                                type="text"
                                label="Search bookings"
                                placeholder="Search by attorney name, service, or reference number..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                leftIcon={<Search className="w-4 h-4" />} 
                            />
                        </div>
                        <div className="w-full md:w-1/4">
                            <Select
                                label="Filter by status"
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
                                Clear filters
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Results Info */}
                {bookings && bookings.length > 0 && (
                    <div className="mb-4 text-sm text-gray-600">
                        Showing {filteredBookings.length} of {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
                    </div>
                )}

                {/* Content */}
                {content}

            </div>
        </Layout>
    );
}