import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Users, Search, Filter, Loader2, ArrowLeft, ArrowRight, TrendingUp, User, Briefcase, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import ToggleSwitch from '@/components/common/ToggleSwitch'; // Requires src/components/common/ToggleSwitch.tsx
import Avatar from '@/components/common/Avatar';

// Assuming these files exist based on our previous discussions:
import { useAdminUserList, useUpdateUserSubscription } from '@/hooks/admin/use-admin-users'; // Requires src/hooks/admin/use-admin-users.ts
import type { AdminUserListItem, UserFilters } from '@/types/admin-types'; // Requires updated src/types/admin-types.ts


// --- LOCAL TYPES ---

interface UserFilterFormInputs {
    search: string;
    userType: 'individual' | 'attorney' | 'business' | 'all';
    isPremium: 'true' | 'false' | 'all';
}

// --- MAIN COMPONENT ---

const AdminUsersPage: React.FC = () => {
    const navigate = useNavigate();
    
    // Define a constant for the limit, but manage 'page' and 'limit' within state
    const LIMIT_PER_PAGE = 15;
    
    // --- Filter Form Setup ---
    const { register, handleSubmit } = useForm<UserFilterFormInputs>({
        defaultValues: { userType: 'all', isPremium: 'all', search: '' },
    });

    // --- State: Consolidating all query parameters into a single object ---
    const [appliedFilters, setAppliedFilters] = React.useState<UserFilters>({
        userType: 'all',
        isPremium: 'all',
        page: 1,
        limit: LIMIT_PER_PAGE, // Using the constant
        search: '', // Requires 'search' property in UserFilters interface
    });
    
    // --- Data Fetching: Use the spread operator to pass properties ---
    const { data, isLoading, isFetching, refetch } = useAdminUserList({
        ...appliedFilters // <-- CORRECT SYNTAX: Spreading properties into the arguments object
    });

    const users = data?.users || [];
    const totalPages = data?.totalPages || 1;

    const { mutate: updateUserSubscription } = useUpdateUserSubscription();
    
    // --- Handlers ---
    
    const onFilterFormSubmit = (formData: UserFilterFormInputs) => {
        // Update state with new filters, ensuring page resets to 1
        setAppliedFilters(prev => ({
            ...prev,
            userType: formData.userType,
            isPremium: formData.isPremium,
            search: formData.search,
            page: 1, // Reset page to 1 on filter change
        }));
    };

    const handlePageChange = (newPage: number) => {
        // Update only the page property in the state
        setAppliedFilters(prev => ({
            ...prev,
            page: newPage,
        }));
    };

    const handleSubscriptionToggle = (user: AdminUserListItem) => {
        const newStatus = !user.isPremium;
        
        updateUserSubscription({
            userId: user.id,
            isPremium: newStatus,
        }, {
            onSuccess: () => {
                toast.success(`Subscription for ${user.fullName} successfully set to ${newStatus ? 'Premium' : 'Standard'}.`);
            }
        });
    };

    const handleViewDetails = (userId: string) => {
        navigate(`/admin/users/${userId}/details`);
    };

    // --- Render Helpers (omitted for brevity) ---
    const getUserTypeDisplay = (userType: string) => {
        switch (userType) {
            case 'attorney':
                return { icon: <Briefcase className="w-3 h-3" />, text: 'Attorney', color: 'bg-primary-100 text-primary-700' };
            case 'business':
                return { icon: <FileText className="w-3 h-3" />, text: 'Business', color: 'bg-indigo-100 text-indigo-700' };
            default: // individual, admin, fitadmin, etc.
                return { icon: <User className="w-3 h-3" />, text: userType.charAt(0).toUpperCase() + userType.slice(1), color: 'bg-gray-100 text-gray-700' };
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Users className="w-7 h-7 text-primary-600" /> User Management
                    </h1>
                    <p className="text-gray-600 mt-1">Manage user accounts, roles, and premium subscriptions.</p>
                </header>

                {/* --- Filters Card --- */}
                <Card className="p-6 mb-8">
                    <form onSubmit={handleSubmit(onFilterFormSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {/* Search */}
                            <div className="md:col-span-2">
                                <div className="relative">
                                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input 
                                        {...register('search')}
                                        type="text"
                                        placeholder="Search by name, email, or phone number..."
                                        className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                            </div>
                            
                            {/* Filter by User Type */}
                            <select {...register('userType')} className="p-2 border border-gray-300 rounded-lg">
                                <option value="all">All User Types</option>
                                <option value="individual">Individual</option>
                                <option value="attorney">Attorney</option>
                                <option value="business">Business/SME</option>
                            </select>

                            {/* Filter by Premium Status */}
                            <select {...register('isPremium')} className="p-2 border border-gray-300 rounded-lg">
                                <option value="all">All Subscriptions</option>
                                <option value="true">Premium Users</option>
                                <option value="false">Standard Users</option>
                            </select>

                            {/* Apply Button */}
                            <Button type="submit" variant="primary" className="w-full">
                                <Filter className="w-4 h-4 mr-2" /> Filter
                            </Button>
                        </div>
                    </form>
                </Card>

                {/* --- Users Table --- */}
                <Card className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type / Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium Access</th>
                                <th className="px-6 py-3">H</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading || isFetching ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary-600 mx-auto mb-2" />
                                        Fetching user list...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-gray-500">
                                        No users found matching these criteria.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => {
                                    const typeDisplay = getUserTypeDisplay(user.userType);
                                    
                                    return (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                <div className="flex items-center">
                                                    <Avatar src={user.avatarUrl || undefined} name={user.fullName} size="sm" className="mr-3" />
                                                    <div>
                                                        <div className="font-medium text-gray-900">{user.fullName}</div>
                                                        <div className="text-xs text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${typeDisplay.color}`}>
                                                    {typeDisplay.icon}
                                                    {typeDisplay.text}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <ToggleSwitch
                                                        checked={user.isPremium}
                                                        onChange={() => handleSubscriptionToggle(user)}
                                                    />
                                                    {user.isPremium && <TrendingUp className="w-4 h-4 text-green-500" />}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Button 
                                                    onClick={() => handleViewDetails(user.id)}
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    View Profile
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </Card>

                {/* --- Pagination --- */}
                <div className="flex justify-between items-center mt-6">
                    <Button 
                        onClick={() => handlePageChange(appliedFilters.page - 1)} 
                        disabled={appliedFilters.page === 1 || isLoading || isFetching}
                        variant="outline"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                    </Button>
                    <span className="text-sm text-gray-700">Page {appliedFilters.page} of {totalPages}</span>
                    <Button 
                        onClick={() => handlePageChange(appliedFilters.page + 1)} 
                        disabled={appliedFilters.page >= totalPages || isLoading || isFetching}
                        variant="outline"
                    >
                        Next <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </Layout>
    );
};

export default AdminUsersPage;