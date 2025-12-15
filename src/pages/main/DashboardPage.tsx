// src/pages/main/DashboardPage.tsx (WITH BOOKING SECTION ADDED)

import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { useProfile } from '@/hooks/auth/use-auth';
import { useUserBookings } from '@/hooks/booking/use-booking-management'; // 🎯 NEW IMPORT

import { 
  TrendingUp, DollarSign, FileText, Loader2, Calculator, Users,
  CreditCard, ArrowRight, Calendar, // 🎯 Calendar and ArrowRight added
} from 'lucide-react';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';
import { formatCurrency } from '@/utils/helpers';
import Layout from '@/components/layout/Layout';
import Button from '@/components/common/Button'; 
import BookingCard from '@/components/bookings/BookingCard'; 


// --- START: General User Dashboard Content (Kept as the default view) ---
const GeneralDashboardContent: React.FC<{ userData: any }> = ({ userData }) => {
    const navigate = useNavigate(); // For button navigation
    const firstName = userData?.fullName?.split(' ')[0] || 'User';

    // 🎯 BOOKING HOOK: Fetch the user's upcoming bookings (limit 3 for dashboard)
    const { data: bookings, isLoading: isLoadingBookings } = useUserBookings('all', 1, 3);
    
    // Filter for pending/confirmed bookings to display as upcoming
    const upcomingBookings = bookings?.filter(b => b.status === 'pending' || b.status === 'confirmed');

    // Mock data for the general user dashboard stats (placeholder)
    const mockGeneralStats = {
        totalExpenses: 550000,
        taxSaved: 120000,
        activeLoans: 0
    };
    
    // --- Helper Component for Quick Action Links ---
    const QuickActionButton: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => (
        <Link 
            to={to} 
            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-full text-primary-600 shadow-sm">{icon}</div>
                <span className="font-medium text-gray-800">{label}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-transform" />
        </Link>
    );
    // ------------------------------------------------------------------

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Welcome Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <Avatar
                                src={userData?.avatarUrl}
                                name={userData?.fullName || 'User'}
                                size="lg"
                            />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Welcome back, {firstName}!
                                </h1>
                                <p className="text-gray-600">Here's your tax overview</p>
                            </div>
                        </div>
                    </div>

                    {/* ----------------------------------------------------- */}
                    {/* 🎯 UPCOMING CONSULTATIONS / BOOKINGS SECTION (NEW) */}
                    {/* ----------------------------------------------------- */}
                    <section className="mt-8 mb-10">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
                                <Calendar className="w-6 h-6 text-primary-600" />
                                Your Upcoming Consultations
                            </h2>
                            <Button 
                                variant="link" 
                                size="sm"
                                onClick={() => navigate('/bookings/my-bookings')}
                                rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                            >
                                View All Bookings
                            </Button>
                        </div>

                        {isLoadingBookings ? (
                            <div className="flex items-center text-gray-500 p-6 justify-center bg-white rounded-lg shadow">
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Loading bookings...
                            </div>
                        ) : upcomingBookings && upcomingBookings.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Map over the upcoming bookings and render BookingCard */}
                                {upcomingBookings.map(booking => (
                                    <BookingCard key={booking._id} booking={booking} />
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 bg-white border border-dashed border-gray-300 rounded-lg text-center">
                                <p className="text-lg text-gray-600 mb-4">
                                    You don't have any pending or confirmed consultations.
                                </p>
                                <Button 
                                    onClick={() => navigate('/find-attorney')} 
                                    variant="primary"
                                    size="md"
                                >
                                    Find and Book an Attorney
                                </Button>
                            </div>
                        )}
                    </section>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                         <Card hover>
                            {/* ... (Total Expenses content remains the same) ... */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-gray-600 text-sm mb-2">Total Expenses</div>
                                    <div className="text-3xl font-bold text-primary-600">
                                        {formatCurrency(mockGeneralStats.totalExpenses)}
                                    </div>
                                    <div className="text-sm text-green-600 mt-1">
                                        +0% from last month
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                    <DollarSign className="w-6 h-6 text-primary-600" />
                                </div>
                            </div>
                        </Card>

                        <Card hover>
                            {/* ... (Active Loans content remains the same) ... */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-gray-600 text-sm mb-2">Active Loans</div>
                                    <div className="text-3xl font-bold text-secondary-600">
                                        {mockGeneralStats.activeLoans}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {mockGeneralStats.activeLoans > 0 ? 'Review status' : 'No active loans'}
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-secondary-600" />
                                </div>
                            </div>
                        </Card>

                        <Card hover>
                            {/* ... (Tax Saved content remains the same) ... */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-gray-600 text-sm mb-2">Tax Saved</div>
                                    <div className="text-3xl font-bold text-green-600">
                                        {formatCurrency(mockGeneralStats.taxSaved)}
                                    </div>
                                    <div className="text-sm text-green-600 mt-1">
                                        This year (estimated)
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Quick Actions & Recent Activity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <Card>
                            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                {/* IMPLEMENTED QUICK ACTIONS */}
                                <QuickActionButton 
                                    to="/expenses"
                                    icon={<DollarSign className="w-4 h-4" />}
                                    label="Add New Expense"
                                />
                                <QuickActionButton 
                                    to="/tax"
                                    icon={<Calculator className="w-4 h-4" />}
                                    label="Use Tax Calculator"
                                />
                                <QuickActionButton 
                                    to="/find-attorney"
                                    icon={<Users className="w-4 h-4" />}
                                    label="Find Tax Attorney"
                                />
                                <QuickActionButton 
                                    to="/loans"
                                    icon={<CreditCard className="w-4 h-4" />}
                                    label="Apply for Tax Loan"
                                />
                            </div>
                        </Card>

                        <Card>
                            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-600">No recent activity</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Start by adding expenses or calculating taxes
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Tax Information Banner */}
                    <Card className="bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
                         {/* ... (Tax Information Banner content remains the same) ... */}
                         <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calculator className="w-5 h-5 text-primary-600" />
                                    <h3 className="font-semibold text-gray-900">Nigerian Tax Calculator</h3>
                                </div>
                                <p className="text-gray-700 mb-4">
                                    Calculate your VAT (15%), income tax, and get tax-saving insights. Stay compliant with Nigerian tax regulations.
                                </p>
                                <Link
                                    to="/tax"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors group"
                                >
                                    <span>Open Tax Calculator</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                            <div className="hidden md:block">
                                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                                    <Calculator className="w-12 h-12 text-primary-600" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};
// --- END: General User Dashboard Content ---


// --- MAIN DASHBOARD MANAGER (With Admin Check) ---

export default function DashboardPage() {
    const { user } = useAuthStore();
    const { data: profile, isLoading: isProfileLoading } = useProfile();
    
    if (isProfileLoading) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                </div>
            </Layout>
        );
    }

    const userData = profile?.user || user;
    
    if (!userData) {
        // 1. Unauthenticated check
        return <Navigate to="/login" replace />; 
    }

    // Define the valid Admin user types based on your system (e.g., 'admin', 'fitadmin')
    const adminUserTypes = ['admin', 'fitadmin'];

    // 2. ADMIN ROLE MANAGER: Check if the user is an admin
    if (adminUserTypes.includes(userData.userType)) {
        return <Navigate to="/admin/dashboard" replace />;
    }
    
    // 3. ATTORNEY ROLE MANAGER: Check if the user is an attorney
    if (userData.userType === 'attorney') {
        return <Navigate to="/attorney/dashboard" replace />;
    }
    
    // 4. Default render for 'individual', 'business', or any other standard user
    return <GeneralDashboardContent userData={userData} />;
}