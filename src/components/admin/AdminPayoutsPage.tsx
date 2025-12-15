import React from 'react';
import { useForm } from 'react-hook-form';
import { DollarSign, Filter, Search, Loader2, ArrowLeft, ArrowRight, CheckCircle, Clock, XCircle, Banknote } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import { formatCurrency } from '@/utils/helpers';

// Assuming these files exist based on our previous discussions:
import { useAdminPayouts, useProcessPayout } from '@/hooks/admin/use-admin-payouts';
import type { PayoutRequest } from '@/types/admin-types'; 


// --- LOCAL TYPES ---

interface PayoutFilterFormInputs {
    status: 'pending' | 'processed' | 'failed' | 'all';
    search: string; // Search by attorney name or ID
}

interface ProcessModalInput {
    processorRef: string;
}

// --- MAIN COMPONENT ---

const AdminPayoutsPage: React.FC = () => {
    const [page, setPage] = React.useState(1);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedPayout, setSelectedPayout] = React.useState<PayoutRequest | null>(null);

    const { register: registerFilter, handleSubmit: handleFilterSubmit, watch: watchFilter } = useForm<PayoutFilterFormInputs>({
        defaultValues: { status: 'pending', search: '' },
    });

    const { register: registerModal, handleSubmit: handleModalSubmit, formState: { errors: modalErrors } } = useForm<ProcessModalInput>();

    const [appliedFilters, setAppliedFilters] = React.useState<Omit<PayoutFilterFormInputs, 'search'>>({
        status: 'pending',
    });
    
    const limit = 15;
    
    // --- Data Fetching ---
    const { data, isLoading, isFetching } = useAdminPayouts({
        page,
        limit,
        status: appliedFilters.status,
    });
    
    const payouts = data?.payouts || [];
    const totalPages = data?.totalPages || 1;

    // --- Mutation Hook ---
    const { mutate: processPayout, isPending: isProcessing } = useProcessPayout();

    // --- Handlers ---
    
    const onFilterFormSubmit = (formData: PayoutFilterFormInputs) => {
        // Here we apply the status filter and can optionally use the search field
        setAppliedFilters({ status: formData.status });
        setPage(1);
    };
    
    const handleProcessRequest = (payout: PayoutRequest) => {
        setSelectedPayout(payout);
        setIsModalOpen(true);
    };

    const onProcessModalSubmit = (formData: ProcessModalInput) => {
        if (!selectedPayout) return;
        
        processPayout({
            payoutId: selectedPayout.payoutId,
            processorRef: formData.processorRef,
        }, {
            onSuccess: () => {
                setIsModalOpen(false);
                setSelectedPayout(null);
            }
        });
    };

    // --- Render Helpers ---

    const getStatusDisplay = (status: PayoutRequest['status']) => {
        switch (status) {
            case 'processed':
                return { icon: <CheckCircle className="w-4 h-4" />, text: 'Processed', color: 'bg-green-100 text-green-700' };
            case 'failed':
                return { icon: <XCircle className="w-4 h-4" />, text: 'Failed', color: 'bg-red-100 text-red-700' };
            default: 
                return { icon: <Clock className="w-4 h-4" />, text: 'Pending', color: 'bg-yellow-100 text-yellow-700' };
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <DollarSign className="w-7 h-7 text-green-600" /> Payouts & Financial Review
                    </h1>
                    <p className="text-gray-600 mt-1">Manage attorney withdrawals and monitor platform transactions.</p>
                </header>

                {/* --- Filters Card --- */}
                <Card className="p-6 mb-8">
                    <form onSubmit={handleFilterSubmit(onFilterFormSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Search (currently unused in hook, but kept for future implementation) */}
                            <div className="md:col-span-2">
                                <div className="relative">
                                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input 
                                        {...registerFilter('search')}
                                        type="text"
                                        placeholder="Search by attorney name or ID..."
                                        className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                            </div>
                            
                            {/* Filter by Status */}
                            <select {...registerFilter('status')} className="p-2 border border-gray-300 rounded-lg">
                                <option value="pending">Pending Requests</option>
                                <option value="processed">Processed Payouts</option>
                                <option value="failed">Failed Payouts</option>
                                <option value="all">All Payouts</option>
                            </select>

                            {/* Apply Button */}
                            <Button type="submit" variant="primary" className="w-full">
                                <Filter className="w-4 h-4 mr-2" /> Apply Filters
                            </Button>
                        </div>
                    </form>
                </Card>

                {/* --- Payouts Table --- */}
                <Card className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payout ID / Attorney</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested At</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref ID</th>
                                <th className="px-6 py-3">H</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading || isFetching ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary-600 mx-auto mb-2" />
                                        Fetching payout requests...
                                    </td>
                                </tr>
                            ) : payouts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-500">
                                        No payout requests found matching these criteria.
                                    </td>
                                </tr>
                            ) : (
                                payouts.map((payout) => {
                                    const statusDisplay = getStatusDisplay(payout.status);
                                    
                                    return (
                                        <tr key={payout.payoutId} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {payout.attorneyName}
                                                <div className="text-xs text-gray-500 mt-0.5">ID: {payout.payoutId.substring(0, 8)}...</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-900">
                                                {formatCurrency(payout.amount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDistanceToNow(new Date(payout.requestedAt), { addSuffix: true })}
                                                <div className="text-xs">{format(new Date(payout.requestedAt), 'MMM dd, yyyy')}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${statusDisplay.color}`}>
                                                    {statusDisplay.icon}
                                                    {statusDisplay.text}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {payout.processorRef || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {payout.status === 'pending' && (
                                                    <Button 
                                                        onClick={() => handleProcessRequest(payout)}
                                                        variant="success"
                                                        size="sm"
                                                        disabled={isProcessing}
                                                    >
                                                        Process Payout
                                                    </Button>
                                                )}
                                                {payout.status === 'processed' && (
                                                    <span className="text-xs text-green-600">Completed</span>
                                                )}
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

            {/* --- Process Payout Modal --- */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title="Process Payout Request"
            >
                <form onSubmit={handleModalSubmit(onProcessModalSubmit)} className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Confirm transfer of **{formatCurrency(selectedPayout?.amount || 0)}** to {selectedPayout?.attorneyName} and enter the bank transaction reference ID.
                    </p>
                    
                    <Input
                        label="Transaction Reference ID"
                        leftIcon={<Banknote className="w-5 h-5" />}
                        placeholder="e.g., BANKREF12345678"
                        {...registerModal('processorRef', { required: 'Transaction Reference is required' })}
                        error={modalErrors.processorRef?.message}
                    />
                    
                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full bg-green-600 hover:bg-green-700"
                        >
                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                            Mark as Processed
                        </Button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

export default AdminPayoutsPage;