import React from 'react';
import { DollarSign, Zap, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import Card from '@/components/common/Card'; 
import Button from '@/components/common/Button'; // Assuming Button component is available
import { formatCurrency } from '@/utils/helpers'; 
import { toast } from 'react-hot-toast';

// 🎯 NEW: Import the optimization hook and types
import { useOptimizeExpenses, OptimizationRecommendation } from '@/hooks/analytics/use-ai-analytics';

// The recommendations prop is no longer needed since we fetch them internally
const ExpenseOptimizationSuggestions: React.FC = () => {
    
    // 🎯 Use the hook to fetch data
    const { 
        data, 
        isLoading, 
        isError, 
        error, 
        refetch, 
        isRefetching
    } = useOptimizeExpenses();

    const recommendations = data?.recommendations || [];
    const totalSavings = data?.totalSavings || 0;

    // Optional: Show error toast if fetching failed
    React.useEffect(() => {
        if (isError) {
            // Note: handleApiError is likely imported inside the hook, 
            // so we handle generic error messaging here.
            toast.error("Failed to load optimization insights. Please try again.");
        }
    }, [isError]);


    // --- RENDERING LOGIC ---

    let content;
    
    if (isLoading) {
        content = (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600 mb-3" />
                <p className='text-md'>Running expense analysis...</p>
                <p className='text-sm'>This may take a moment.</p>
            </div>
        );
    } else if (isError) {
        content = (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-red-600">
                <p className="text-lg mb-4">Analysis Failed</p>
                <Button 
                    variant='primary' 
                    onClick={() => refetch()} 
                    disabled={isRefetching}
                    leftIcon={<RefreshCw className='w-4 h-4' />}
                >
                    {isRefetching ? 'Retrying...' : 'Retry Analysis'}
                </Button>
                <p className="text-sm text-gray-500 mt-2">Error: {error?.message}</p>
            </div>
        );
    } else if (recommendations.length === 0) {
        content = (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-gray-600">
                <Zap className="w-8 h-8 text-gray-400 mb-3" />
                <p className="text-lg font-semibold mb-2">No Optimization Found</p>
                <p className="text-sm text-center">Your current spending habits are already highly optimized or insufficient data is available.</p>
            </div>
        );
    } else {
        // Display recommendations
        content = (
            <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                {recommendations.map((rec) => (
                    <div key={rec.id} className="p-4 border border-gray-100 rounded-lg transition duration-200 hover:bg-primary-50">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-gray-800">{rec.area}</h4>
                            <span className="text-xs font-medium bg-green-100 text-green-700 py-1 px-3 rounded-full flex items-center">
                                <DollarSign className="w-3 h-3 mr-1" />
                                Save {formatCurrency(rec.potentialSavings)}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{rec.suggestion}</p>
                        <a href="#" className="text-primary-500 text-sm font-medium flex items-center hover:text-primary-700">
                            View Plan <ArrowRight className="w-4 h-4 ml-1" />
                        </a>
                    </div>
                ))}
            </div>
        );
    }


    return (
        <Card className="p-6 bg-white shadow-xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                <div className="flex items-center text-primary-600">
                    <Zap className="w-6 h-6 mr-2" />
                    <h2 className="text-xl font-bold">Optimization Insights</h2>
                </div>
                {/* Refetch button for fresh data when not loading */}
                {!isLoading && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => refetch()}
                        disabled={isRefetching}
                        leftIcon={<RefreshCw className={isRefetching ? 'w-4 h-4 animate-spin' : 'w-4 h-4'} />}
                    >
                        {isRefetching ? 'Refreshing...' : 'Refresh'}
                    </Button>
                )}
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
                Based on your historical spending, we have identified key areas for tax savings and expense reduction.
            </p>

            <div className="flex-1">
                {content}
            </div>

            {/* Display Footer only if data is loaded successfully */}
            {!isLoading && !isError && recommendations.length > 0 && (
                <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                    <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-gray-700">Total Potential Annual Savings:</span>
                        <span className="text-2xl font-extrabold text-green-700">{formatCurrency(totalSavings)}</span>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default ExpenseOptimizationSuggestions;