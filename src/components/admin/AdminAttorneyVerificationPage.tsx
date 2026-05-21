import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Search, UserCheck, Clock, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
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

    const { data, isLoading, isFetching, isError, error } = useAdminVerificationList({
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
        const attorney = attorneys.find(a => {
            const id = a._id || a.id || (a as any).attorneyId || (a as any).userId?.id;
            return id === attorneyId;
        });

        navigate(`/admin/attorneys/${attorneyId}/review`, {
            state: attorney ? { attorney } : undefined,
        });
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <UserCheck className="w-7 h-7 text-primary-600" /> Attorney verification queue
                        </h1>
                        <p className="text-gray-600 mt-1">Review and approve submissions from new attorneys</p>
                    </div>
                    <div className="text-xl font-semibold text-primary-600">
                        Total queued: {data?.total || 0}
                    </div>
                </header>

                {/* Show error message if API fails */}
                {isError && (
                    <Card className="mb-8 p-6 bg-red-50 border-red-200">
                        <div className="flex items-start gap-3 text-red-800">
                            <AlertCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                                <p className="font-semibold text-lg mb-2">Failed to load attorney verification queue</p>
                                <p className="text-sm mb-3">
                                    <strong>Error:</strong> {error?.response?.data?.message || error?.message || 'Internal server error (500)'}
                                </p>
                                <div className="bg-white bg-opacity-50 rounded p-3 mb-3">
                                    <p className="text-sm font-semibold mb-2">Common causes:</p>
                                    <ul className="text-sm ml-4 list-disc space-y-1">
                                        <li><strong>Database connection issue</strong> - Backend can't connect to MongoDB</li>
                                        <li><strong>No attorneys registered yet</strong> - The attorneys collection is empty</li>
                                        <li><strong>Missing indexes</strong> - Database needs proper indexes for the query</li>
                                        <li><strong>Authentication issue</strong> - Admin token might not be properly validated</li>
                                        <li><strong>Endpoint logic error</strong> - Bug in the backend code</li>
                                    </ul>
                                </div>
                                <div className="text-sm">
                                    <p className="font-semibold mb-1">To debug:</p>
                                    <ol className="ml-4 list-decimal space-y-1">
                                        <li>Check browser console for error details</li>
                                        <li>Check backend server logs</li>
                                        <li>Verify database connection</li>
                                        <li>Test the endpoint with Postman/Thunder Client</li>
                                    </ol>
                                </div>
                                <div className="mt-4 pt-4 border-t border-red-300">
                                    <p className="text-xs">
                                        <strong>Request details:</strong> GET /api/v1/admin/attorneys/verification?page={page}&limit=10&status={appliedFilters.status}&sortBy={appliedFilters.sortBy}&sortOrder={appliedFilters.sortOrder}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

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
                                <option value="pending">Pending review</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="all">All statuses</option>
                            </select>
                            <select {...register('sortBy')} className="p-2 border border-gray-300 rounded-lg">
                                <option value="submittedAt">Date submitted</option>
                                <option value="name">Name</option>
                                <option value="experience">Experience</option>
                            </select>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button type="submit" variant="primary" className="w-full md:w-auto">
                                <Filter className="w-4 h-4 mr-2" /> Apply filters
                            </Button>
                        </div>
                    </form>
                </Card>

                <Card className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attorney name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Firm / Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3">Action</th>
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
                            ) : isError ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-500">
                                        Unable to load attorneys. Please check the error message above.
                                    </td>
                                </tr>
                            ) : attorneys.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-500">
                                        No attorneys found matching these criteria.
                                    </td>
                                </tr>
                            ) : (
                                attorneys.map((attorney, index) => {
                                    const attorneyId = attorney._id || attorney.id || (attorney as any).attorneyId || (attorney as any).userId;
                                    const statusDisplay = getStatusDisplay(attorney.verificationStatus || 'pending');
                                    const submittedDate = attorney.submittedForVerificationAt ? new Date(attorney.submittedForVerificationAt) : null;
                                    
                                    return (
                                        <tr key={attorneyId || index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {attorney.fullName || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{attorney.firmName || 'N/A'}</div>
                                                <div className="text-xs text-gray-500">{attorney.email || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {attorney.yearsOfExperience || 0} yrs
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
                                                {attorneyId ? (
                                                    <Button
                                                        onClick={() => handleViewDetails(attorneyId)}
                                                        variant="ghost"
                                                        className="text-primary-600 hover:text-primary-900"
                                                    >
                                                        Review
                                                    </Button>
                                                ) : (
                                                    <span className="text-xs text-red-600">No ID</span>
                                                )}
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