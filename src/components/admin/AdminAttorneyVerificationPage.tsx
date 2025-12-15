import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Search, UserCheck, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAdminVerificationList } from '@/hooks/attorney/use-verification'; 
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';

import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

// Define the shape of the filter form inputs
interface FilterFormInputs {
    search: string;
    status: 'all' | 'pending' | 'approved' | 'rejected';
    sortBy: 'submittedAt' | 'name' | 'experience' | 'status';
    sortOrder: 'asc' | 'desc';
}

const AdminAttorneyVerificationPage: React.FC = () => {
    const navigate = useNavigate();
    const [page, setPage] = React.useState(1);
    
    const [appliedFilters, setAppliedFilters] = React.useState({
        status: 'pending',
        sortBy: 'submittedAt',
        sortOrder: 'desc',
        search: '',
    });

    const { register, watch, handleSubmit } = useForm<FilterFormInputs>({
        defaultValues: {
            search: '',
            status: 'pending',
            sortBy: 'submittedAt',
            sortOrder: 'desc',
        },
    });
    
    const statusWatch = watch('status');
    const sortByWatch = watch('sortBy');
    const sortOrderWatch = watch('sortOrder');

    const { data, isLoading, isFetching } = useAdminVerificationList({
        page,
        limit: 10,
        ...appliedFilters,
    });

    const attorneys = data?.attorneys || [];
    const totalPages = data?.totalPages || 1;

    const handleFilterSubmit = (data: FilterFormInputs) => {
        setAppliedFilters({
            status: data.status,
            sortBy: data.sortBy,
            sortOrder: data.sortOrder,
            search: data.search,
        });
        setPage(1);
    };

    React.useEffect(() => {
        const submitForm = handleSubmit(handleFilterSubmit);
        submitForm();
    }, [statusWatch, sortByWatch, sortOrderWatch]); 

    const getStatusDisplay = (status: string) => {
        switch (status) {
            case 'approved':
                return { icon: <CheckCircle className="w-4 h-4" />, text: 'Approved', color: 'bg-green-100 text-green-700' };
            case 'rejected':
                return { icon: <XCircle className="w-4 h-4" />, text: 'Rejected', color: 'bg-red-100 text-red-700' };
            default: 
                return { icon: <Clock className="w-4 h-4" />, text: 'Pending', color: 'bg-yellow-100 text-yellow-700' };
        }
    };
    
    const handleViewDetails = (attorneyId: string) => {
        navigate(`/admin/attorneys/${attorneyId}/review`);
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <UserCheck className="w-7 h-7 text-primary-600" /> Attorney Verification Queue
                        </h1>
                        <p className="text-gray-600 mt-1">Review and approve submissions from new attorneys.</p>
                    </div>
                    <div className="text-xl font-semibold text-primary-600">
                        Total Queued: {data?.total || 0}
                    </div>
                </header>

                <Card className="p-6 mb-8">
                    <form onSubmit={handleSubmit(handleFilterSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                                <div className="relative">
                                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input 
                                        {...register('search')}
                                        type="text"
                                        placeholder="Search by name, email, or firm name..."
                                        className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                            </div>
                            <select {...register('status')} className="p-2 border border-gray-300 rounded-lg">
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="all">All Statuses</option>
                            </select>
                            <select {...register('sortBy')} className="p-2 border border-gray-300 rounded-lg">
                                <option value="submittedAt">Date Submitted</option>
                                <option value="name">Name</option>
                                <option value="experience">Experience</option>
                            </select>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button type="submit" variant="primary" className="w-full md:w-auto">
                                <Filter className="w-4 h-4 mr-2" /> Apply Filters
                            </Button>
                        </div>
                    </form>
                </Card>

                <Card className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attorney Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Firm / Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3">H</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading || isFetching ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary-600 mx-auto mb-2" />
                                        Fetching queue...
                                    </td>
                                </tr>
                            ) : attorneys.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-500">
                                        No attorneys found matching these criteria.
                                    </td>
                                </tr>
                            ) : (
                                attorneys.map((attorney) => {
                                    const statusDisplay = getStatusDisplay(attorney.attorneyProfile.verificationStatus || 'pending');
                                    const submittedDate = attorney.attorneyProfile.submittedForVerificationAt ? new Date(attorney.attorneyProfile.submittedForVerificationAt) : null;
                                    
                                    return (
                                        <tr key={attorney.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {attorney.fullName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{attorney.attorneyProfile.firmName}</div>
                                                <div className="text-xs text-gray-500">{attorney.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {attorney.attorneyProfile.yearsOfExperience} yrs
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {submittedDate ? format(submittedDate, 'MMM dd, yyyy') : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${statusDisplay.color}`}>
                                                    {statusDisplay.icon}
                                                    {statusDisplay.text}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Button 
                                                    onClick={() => handleViewDetails(attorney.id)}
                                                    variant="ghost"
                                                    className="text-primary-600 hover:text-primary-900"
                                                >
                                                    Review
                                                </Button>
                                            </td>
                                        </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </Card>

                <div className="flex justify-between items-center mt-6">
                    <Button 
                        onClick={() => setPage(p => Math.max(1, p - 1))} 
                        disabled={page === 1 || isLoading || isFetching}
                        variant="outline"
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>
                    <Button 
                        onClick={() => setPage(p => p + 1)} 
                        disabled={page >= totalPages || isLoading || isFetching}
                        variant="outline"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </Layout>
    );
};

export default AdminAttorneyVerificationPage;