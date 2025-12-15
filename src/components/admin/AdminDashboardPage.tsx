// src/pages/admin/AdminDashboardPage.tsx

import React from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import { Settings, Users, FileText, DollarSign, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

// Placeholder for key statistics (will be replaced by an API hook later)
const mockStats = [
    { label: 'Attorneys Pending Review', value: 12, icon: FileText, color: 'text-yellow-600', bg: 'bg-yellow-100', link: '/admin/attorneys/verification' },
    { label: 'Total Active Users', value: 850, icon: Users, color: 'text-primary-600', bg: 'bg-primary-100', link: '/admin/users' },
    { label: 'Pending Payouts', value: '$15,500', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100', link: '/admin/payouts' },
    { label: 'Last Audit Log Entry', value: '2 mins ago', icon: Clock, color: 'text-red-600', bg: 'bg-red-100', link: '/admin/audit' },
];

const AdminDashboardPage: React.FC = () => {
  return (
    <Layout>
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Settings className="w-7 h-7 text-primary-600" /> Admin Control Panel
                </h1>
                <p className="text-gray-600 mt-1">Centralized dashboard for system oversight and management.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {mockStats.map((stat) => (
                    <Link to={stat.link} key={stat.label}>
                        <Card className="p-5 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-center">
                                <div className={`p-3 rounded-full mr-4 ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>

            <Card className="p-8">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Admin To-Do List</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li><Link to="/admin/attorneys/verification" className="text-primary-600 hover:underline">Review 12 pending attorney submissions.</Link></li>
                    <li>Process outstanding payout requests.</li>
                    <li>Monitor recent security activity in the <Link to="/admin/audit" className="text-primary-600 hover:underline">Audit Log</Link>.</li>
                </ul>
            </Card>
        </div>
    </Layout>
  );
};

export default AdminDashboardPage;