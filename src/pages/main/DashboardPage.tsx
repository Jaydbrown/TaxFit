import React from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useProfile } from '@/hooks/auth/use-auth';
import { TrendingUp, DollarSign, FileText, Loader2 } from 'lucide-react';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';
import { formatCurrency } from '@/utils/helpers';
import Layout from '@/components/layout/Layout';

export default function DashboardPage() {
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


  const userData = profile?.data?.user || user;
  const firstName = userData?.fullName?.split(' ')[0] || 'User';

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
                  {formatCurrency(0)}
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
                <div className="text-3xl font-bold text-secondary-600">0</div>
                <div className="text-sm text-gray-600 mt-1">No active loans</div>
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
                  {formatCurrency(0)}
                </div>
                <div className="text-sm text-green-600 mt-1">This year</div>
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
              <a
                href="/expenses"
                className="block px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Add Expense</div>
                <div className="text-sm text-gray-600">Track your business expenses</div>
              </a>
              <a
                href="/find-attorney"
                className="block px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Find Attorney</div>
                <div className="text-sm text-gray-600">Get expert tax advice</div>
              </a>
              <a
                href="/loans"
                className="block px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Apply for Loan</div>
                <div className="text-sm text-gray-600">Grow your business</div>
              </a>
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
                Start by adding expenses or finding an attorney
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
    </Layout>
  );
}