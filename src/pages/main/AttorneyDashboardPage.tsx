import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { useProfile } from '@/hooks/auth/use-auth';
import { 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Loader2, 
  Users, // Used for Clients
  Clock, // Used for Billable Hours
  BarChart3, // Used for Revenue
  CheckCircle, // Used for Tasks
  UserCheck, // Used for Profile completion
  ArrowRight,
} from 'lucide-react';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';
import { formatCurrency } from '@/utils/helpers';
import Layout from '@/components/layout/Layout';

// --- MOCK DATA FOR ATTORNEY METRICS ---
// In a real app, this would be fetched via a useAttorneyMetrics query
interface AttorneyMetrics {
    billableHours: number;
    activeClients: number;
    totalRevenue: number;
    pendingTasks: number;
}

const mockAttorneyMetrics: AttorneyMetrics = {
    billableHours: 125.5,
    activeClients: 12,
    totalRevenue: 5_250_000, // NGN 5.25 Million
    pendingTasks: 5,
};

export default function AttorneyDashboardPage() {
  const { user } = useAuthStore();
  const { data: profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      </Layout>
    );
  }

  // Use the profile data safely
  const userData = profile?.user || user;
  const attorneyProfile = profile?.attorney;
  const firstName = userData?.fullName?.split(' ')[0] || 'Attorney';
  const firmName = attorneyProfile?.firmName;
  const hourlyRate = attorneyProfile?.hourlyRate;
  
  // Example metric access
  const metrics = mockAttorneyMetrics;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Avatar
                src={userData?.avatarUrl}
                name={userData?.fullName || 'Attorney'}
                size="lg"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome, {firstName}!
                </h1>
                <p className="text-gray-600">
                    {firmName ? `Managing Dashboard for ${firmName}` : "Attorney Practice Overview"}
                </p>
              </div>
            </div>
          </div>

          {/* Practice Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card hover>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm mb-2">Active Clients</div>
                  <div className="text-3xl font-bold text-secondary-600">
                    {metrics.activeClients}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Ready for consultation</div>
                </div>
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-secondary-600" />
                </div>
              </div>
            </Card>

            <Card hover>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm mb-2">Billable Hours (MTD)</div>
                  <div className="text-3xl font-bold text-primary-600">
                    {metrics.billableHours} hrs
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    Potential: {formatCurrency(metrics.billableHours * (hourlyRate || 50000))}
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </Card>

            <Card hover>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm mb-2">Total Revenue (YTD)</div>
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(metrics.totalRevenue)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Based on closed cases</div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>
            
             <Card hover>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm mb-2">Pending Tasks</div>
                  <div className="text-3xl font-bold text-red-600">
                    {metrics.pendingTasks}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Unread messages & approvals</div>
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
                <Link
                  to="/attorney/clients"
                  className="block px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Client & Case Portal</div>
                      <div className="text-sm text-gray-600">Manage all open cases and client communications.</div>
                    </div>
                    <Users className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  </div>
                </Link>

                <Link
                  to="/attorney/billing"
                  className="block px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Billing & Invoicing</div>
                      <div className="text-sm text-gray-600">Generate invoices, track payments, and set rates.</div>
                    </div>
                    <DollarSign className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  </div>
                </Link>

                <Link
                  to="/attorney/resources"
                  className="block px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Tax Law Updates</div>
                      <div className="text-sm text-gray-600">Access the latest Nigerian tax legislation and news.</div>
                    </div>
                    <FileText className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  </div>
                </Link>

                <Link
                  to="/profile/settings"
                  className="block px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group"
                >
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

            <Card>
              <h2 className="text-xl font-semibold mb-4">Recent Client Activity</h2>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary-600" />
                </div>
                <p className="text-gray-600">No new client messages today</p>
                <p className="text-sm text-gray-500 mt-1">
                  You have {metrics.pendingTasks} unread tasks in the client portal.
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
}