// src/pages/main/DashboardPage.tsx
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { useProfile } from '@/hooks/auth/use-auth';
// Removed useQuery and apiClient imports as they are no longer needed here.

import { 
  TrendingUp, DollarSign, FileText, Loader2, Calculator, Users,
  CreditCard, ArrowRight,
} from 'lucide-react';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';
import { formatCurrency } from '@/utils/helpers';
import Layout from '@/components/layout/Layout';

// --- START: General User Dashboard Content (Kept as the default view) ---
const GeneralDashboardContent: React.FC<{ userData: any }> = ({ userData }) => {
    const firstName = userData?.fullName?.split(' ')[0] || 'User';

    // Mock data for the general user dashboard stats (placeholder)
    const mockGeneralStats = {
        totalExpenses: 550000,
        taxSaved: 120000,
        activeLoans: 0
    };

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

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card hover>
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

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <Card>
                            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                <Link to="/expenses" /* ... */ >{/* ... */}</Link>
                                <Link to="/tax" /* ... */ >{/* ... */}</Link>
                                <Link to="/find-attorney" /* ... */ >{/* ... */}</Link>
                                <Link to="/loans" /* ... */ >{/* ... */}</Link>
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


// --- MAIN DASHBOARD MANAGER ---

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
        // Unauthenticated check
        return <Navigate to="/login" replace />; 
    }

    const isAttorney = userData?.userType === 'attorney';
    
    // 🎯 ROLE MANAGER: If attorney, redirect to their dedicated path defined in App.tsx
    if (isAttorney) {
        return <Navigate to="/attorney/dashboard" replace />;
    }
    
    // Default render for 'individual' and 'business' users
    return <GeneralDashboardContent userData={userData} />;
}