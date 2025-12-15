import React from 'react';
import { useExpenseAnomalies, ExpenseAnomaly } from '@/hooks/analytics/use-ai-analytics';
import Card from '@/components/common/Card';
import { AlertTriangle, Loader2, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/helpers';
import Button from '@/components/common/Button';

const AnomalyItem: React.FC<{ anomaly: ExpenseAnomaly }> = ({ anomaly }) => (
    <div className="p-3 border border-yellow-200 rounded-lg bg-yellow-50 mb-3">
        <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-gray-800 text-sm">{anomaly.expenseTitle}</span>
            <span className="text-xs font-medium text-red-700">
                {formatCurrency(anomaly.amount)}
            </span>
        </div>
        <p className="text-xs text-yellow-800 italic">{anomaly.reason}</p>
        <p className="text-xs text-gray-500 mt-1">Date: {formatDate(anomaly.date)}</p>
    </div>
);


export default function ExpenseAnomaliesCard() {
    const { data: anomalies, isLoading, isError, refetch } = useExpenseAnomalies();
    
    let content;

    if (isLoading) {
        content = (
            <div className="flex items-center justify-center h-full min-h-[150px]">
                <Loader2 className="w-6 h-6 animate-spin text-yellow-600 mr-2" />
                <p className="text-gray-600">Detecting anomalies...</p>
            </div>
        );
    } else if (isError) {
        content = (
            <div className="flex flex-col items-center justify-center h-full min-h-[150px] text-red-600">
                <p className="text-sm mb-2">Failed to detect anomalies.</p>
                <Button variant="ghost" size="sm" onClick={() => refetch()}>Retry</Button>
            </div>
        );
    } else if (anomalies && anomalies.length > 0) {
        content = (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                {anomalies.map(anomaly => (
                    <AnomalyItem key={anomaly.id} anomaly={anomaly} />
                ))}
            </div>
        );
    } else {
        content = (
            <div className="flex flex-col items-center justify-center h-full min-h-[150px] text-green-600">
                <p className="text-lg font-semibold">No Unusual Patterns Detected</p>
                <p className="text-sm text-gray-600">Your expenses are consistent with historical data.</p>
            </div>
        );
    }

    return (
        <Card className="p-5 bg-white shadow-lg">
            <div className="flex items-center text-yellow-700 mb-4 pb-2 border-b border-yellow-100">
                <AlertTriangle className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-bold">Expense Anomalies</h3>
            </div>
            {content}
        </Card>
    );
}