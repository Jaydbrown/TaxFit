import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Search, Filter, History, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import  { useAdminAuditLog } from '@/hooks/admin/use-admin-audit'; // Hook from the previous response
import type { AuditLog } from '@/types/admin-types';

// --- Local Types for Form/State ---

interface AuditFilterFormInputs {
    search: string;
    action?: string;
    resourceType?: string;
}

const AuditLogPage: React.FC = () => {
    const [page, setPage] = React.useState(1);
    const [appliedFilters, setAppliedFilters] = React.useState<AuditFilterFormInputs>({
        search: '',
        action: undefined,
        resourceType: undefined,
    });
    
    const limit = 15; // Define the number of items per page

    const { register, watch, handleSubmit } = useForm<AuditFilterFormInputs>({
        defaultValues: appliedFilters,
    });

    // --- Data Fetching Hook ---
    const { data, isLoading, isFetching } = useAdminAuditLog({
        page,
        limit,
        ...appliedFilters,
    });
    
    const logs = data?.logs || [];
    const totalPages = data?.total || 1;

    // --- Handlers ---
    const handleFilterSubmit = (formData: AuditFilterFormInputs) => {
        setAppliedFilters(formData);
        setPage(1); // Reset to page 1 on new filter search
    };

    const handleViewUser = (actorId: string) => {
        // Assume an endpoint exists for viewing any user's profile in admin
        // navigate(`/admin/users/${actorId}`);
        alert(`Navigating to profile for Actor ID: ${actorId}`);
    };

    // --- Render Logic ---

    // A helper function to color-code the action type
    const getActionChip = (action: string) => {
        let color = 'bg-gray-100 text-gray-700';
        if (action.includes('APPROVED') || action.includes('CREATED') || action.includes('VERIFIED')) {
            color = 'bg-green-100 text-green-700';
        } else if (action.includes('REJECTED') || action.includes('DELETED') || action.includes('BANNED')) {
            color = 'bg-red-100 text-red-700';
        } else if (action.includes('LOGIN') || action.includes('FAILED') || action.includes('TOKEN')) {
            color = 'bg-yellow-100 text-yellow-700';
        }
        return <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${color}`}>{action.replace(/_/g, ' ')}</span>;
    };
    
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <History className="w-7 h-7 text-primary-600" /> System Audit Log
                    </h1>
                    <p className="text-gray-600 mt-1">Review critical administrative and user security actions across the platform.</p>
                </header>

                {/* --- Filters Card --- */}
                <Card className="p-6 mb-8">
                    <form onSubmit={handleSubmit(handleFilterSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="md:col-span-2">
                                <div className="relative">
                                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input 
                                        {...register('search')}
                                        type="text"
                                        placeholder="Search by IP address, user ID, or resource ID..."
                                        className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                            </div>
                            
                            {/* Filter by Action */}
                            <select {...register('action')} className="p-2 border border-gray-300 rounded-lg">
                                <option value="">All Actions</option>
                                <option value="LOGIN_SUCCESS">Login Success</option>
                                <option value="LOGIN_FAILED">Login Failed</option>
                                <option value="ATTORNEY_APPROVED">Attorney Approved</option>
                                <option value="USER_DELETED">User Deleted</option>
                                <option value="PASSWORD_RESET">Password Reset</option>
                                {/* Add more relevant action options */}
                            </select>

                            {/* Filter by Resource Type */}
                            <select {...register('resourceType')} className="p-2 border border-gray-300 rounded-lg">
                                <option value="">All Resources</option>
                                <option value="User">User</option>
                                <option value="Attorney">Attorney Profile</option>
                                <option value="Payout">Payout Request</option>
                                {/* Add more resource types */}
                            </select>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button type="submit" variant="primary" className="w-full md:w-auto">
                                <Filter className="w-4 h-4 mr-2" /> Apply Filters
                            </Button>
                        </div>
                    </form>
                </Card>

                {/* --- Audit Log Table --- */}
                <Card className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actor / IP</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading || isFetching ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary-600 mx-auto mb-2" />
                                        Fetching audit logs...
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-gray-500">
                                        No audit logs found matching these criteria.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log: AuditLog) => (
                                    <tr key={log.logId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                            <div className="text-xs text-gray-500">{format(new Date(log.timestamp), 'MMM dd, HH:mm:ss')}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getActionChip(log.action)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="font-medium text-gray-900">{log.actorId} (ID)</div>
                                            <div className="text-xs">{log.ipAddress}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {log.resourceType} ({log.resourceId.substring(0, 8)}...)
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Button 
                                                onClick={() => handleViewUser(log.actorId)}
                                                variant="ghost"
                                                size="sm"
                                            >
                                                View Actor
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </Card>

                {/* --- Pagination --- */}
                <div className="flex justify-between items-center mt-6">
                    <Button 
                        onClick={() => setPage(p => Math.max(1, p - 1))} 
                        disabled={page === 1 || isLoading || isFetching}
                        variant="outline"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                    </Button>
                    <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>
                    <Button 
                        onClick={() => setPage(p => p + 1)} 
                        disabled={page >= totalPages || isLoading || isFetching}
                        variant="outline"
                    >
                        Next <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </Layout>
    );
};

export default AuditLogPage;