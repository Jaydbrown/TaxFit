// src/components/attorney/AttorneyDashboardContent.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { useProfile } from '@/hooks/auth/use-auth';
import { useQuery } from '@tanstack/react-query'; 
import apiClient from '@/lib/api-client'; 

import { 
  TrendingUp, DollarSign, FileText, Loader2, Users, Clock,
  BarChart3, CheckCircle, UserCheck, ArrowRight,
} from 'lucide-react';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';
import { formatCurrency } from '@/utils/helpers';
import Layout from '@/components/layout/Layout';

// Assuming types are available via imports or globally defined
import type { User, AttorneyProfile } from '@/types'; 
// Assuming AttorneyDashboardStats is correctly imported from '@/types/dashboard' as per your input
import type { AttorneyDashboardStats } from '@/types/dashboard' 

// --- INTERFACES & HOOK (Defined locally for a self-contained component) ---

interface AttorneyDashboardStatsResponse {
    success: boolean;
    data: AttorneyDashboardStats;
}
interface ApiError { response?: { data?: { message?: string; }; }; message: string; }

function useAttorneyDashboardStats() {
    const { isAuthenticated, user } = useAuthStore();
    const isAttorney = user?.userType === 'attorney';
    const initialStats: AttorneyDashboardStats = {
        earnings: { totalEarnings: 0, walletBalance: 0, pendingWithdrawal: 0 },
        consultations: { totalCompleted: 0, upcoming: 0 },
        performance: { averageRating: 0, totalReviews: 0 },
    };

    return useQuery<AttorneyDashboardStats, ApiError>({
        queryKey: ['attorneyDashboardStats', user?.id],
        queryFn: async () => {
            const response = await apiClient.get<AttorneyDashboardStatsResponse>('/attorney/dashboard-stats');
            return response.data.data;
        },
        enabled: isAuthenticated && isAttorney, 
        staleTime: 5 * 60 * 1000, 
        initialData: initialStats,
    });
}

// --- MAIN ATTORNEY DASHBOARD CONTENT ---

const AttorneyDashboardContent: React.FC = () => {
    const { user: authUser } = useAuthStore();
    const { data: profile } = useProfile();
    const { data: stats, isLoading: isStatsLoading } = useAttorneyDashboardStats();

    const userData = profile?.user || authUser;
    const attorneyProfile = profile?.attorney as AttorneyProfile; // Cast to ensure type safety if possible
    const firstName = userData?.fullName?.split(' ')[0] || 'Attorney';
    const firmName = attorneyProfile?.firmName;
    
    const { earnings, consultations, performance } = stats;

    const statValue = (value: number | string, unit = '', color = 'text-gray-900') => (
        <div className={`text-3xl font-bold ${color}`}>
            {isStatsLoading ? <Loader2 className="w-6 h-6 text-primary-500 animate-spin" /> : `${value}${unit}`}
        </div>
    );
    
    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <Avatar src={userData?.avatarUrl ?? undefined} name={userData?.fullName || 'Attorney'} size="lg" />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Welcome, {firstName}!</h1>
                                <p className="text-gray-600">
                                    {firmName ? `Managing Dashboard for ${firmName}` : "Attorney Practice Overview"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card hover>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-gray-600 text-sm mb-2">Active Consultations</div>
                                    {statValue(consultations.upcoming, '', 'text-secondary-600')}
                                    <div className="text-sm text-gray-600 mt-1">Upcoming consultations</div>
                                </div>
                                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-6 h-6 text-secondary-600" />
                                </div>
                            </div>
                        </Card>
                        
                        {/* Stat Card 2: Wallet Balance */}
                        <Card hover>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-gray-600 text-sm mb-2">Wallet Balance</div>
                                    {statValue(formatCurrency(earnings.walletBalance), '', 'text-primary-600')}
                                    <div className="text-sm text-green-600 mt-1">
                                        Pending: {formatCurrency(earnings.pendingWithdrawal)}
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-primary-600" />
                                </div>
                            </div>
                        </Card>

                        {/* Stat Card 3: Total Earnings */}
                        <Card hover>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-gray-600 text-sm mb-2">Total Earnings (YTD)</div>
                                    {statValue(formatCurrency(earnings.totalEarnings), '', 'text-green-600')}
                                    <div className="text-sm text-gray-600 mt-1">
                                        Completed: {consultations.totalCompleted} cases
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <BarChart3 className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </Card>
                        
                        {/* Stat Card 4: Average Rating */}
                        <Card hover>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-gray-600 text-sm mb-2">Average Rating</div>
                                    {statValue(performance.averageRating.toFixed(1), ' / 5.0', 'text-red-600')}
                                    <div className="text-sm text-gray-600 mt-1">
                                        Based on {performance.totalReviews} reviews
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Quick Actions & Activity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <Card>
                            <h2 className="text-xl font-semibold mb-4">Practice Management</h2>
                            <div className="space-y-3">
                                {/* Link 1: Client & Case Portal */}
                                <Link to="/attorney/clients" className="block px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">Client & Case Portal</div>
                                            <div className="text-sm text-gray-600">Manage all open cases and client communications.</div>
                                        </div>
                                        <Users className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                                    </div>
                                </Link>
                                
                                {/* Link 2: Billing & Invoicing */}
                                <Link to="/attorney/billing" className="block px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">Billing & Invoicing</div>
                                            <div className="text-sm text-gray-600">Generate invoices, track payments, and set rates.</div>
                                        </div>
                                        <DollarSign className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                                    </div>
                                </Link>

                                {/* Link 3: Tax Law Updates */}
                                <Link to="/attorney/resources" className="block px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">Tax Law Updates</div>
                                            <div className="text-sm text-gray-600">Access the latest Nigerian tax legislation and news.</div>
                                        </div>
                                        <FileText className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                                    </div>
                                </Link>

                                {/* Link 4: Update Profile Visibility */}
                                <Link to="/profile/settings" className="block px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">Update Profile Visibility</div>
                                            <div className="text-sm text-gray-600">Control your listing status and public information.</div>
                                        </div>
                                        <UserCheck className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                                    </div>
                                </Link>
                            </div>
                        </Card>

                        {/* Recent Client Activity Card */}
                        <Card>
                            <h2 className="text-xl font-semibold mb-4">Recent Client Activity</h2>
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-primary-600" />
                                </div>
                                <p className="text-gray-600">No new client messages today</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    You have {consultations.upcoming} upcoming consultations.
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Profile Completion Banner */}
                    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <UserCheck className="w-5 h-5 text-green-600" />
                                    <h3 className="font-semibold text-gray-900">Increase Your Visibility</h3>
                                </div>
                                <p className="text-gray-700 mb-4">
                                    Your profile completion is **75%**. Complete your bio and add specializations to attract more high-value clients.
                                </p>
                                <Link
                                    to="/profile/settings"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors group"
                                >
                                    <span>Complete Profile</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                            <div className="hidden md:block">
                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                                    <TrendingUp className="w-12 h-12 text-green-600" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default AttorneyDashboardContent;