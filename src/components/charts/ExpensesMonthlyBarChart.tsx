import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from '@/components/common/Card'; 
import { formatCurrency } from '@/utils/helpers';

interface MonthlyExpense {
  month: string;
  totalApprovedAmount: number;
}

interface TaxSummary {
  taxYear: number;
  probableTax: number;
  actualTax: number;
}

interface ExpensesMonthlyBarChartProps {
  monthlyData: MonthlyExpense[];
  taxSummary: TaxSummary;
}

const ExpensesMonthlyBarChart: React.FC<ExpensesMonthlyBarChartProps> = ({ monthlyData, taxSummary }) => {
  const maxAmount = monthlyData.length > 0 ? Math.max(...monthlyData.map(d => d.totalApprovedAmount)) : 0;
  const taxDifference = taxSummary.probableTax - taxSummary.actualTax;
  const savingsClass = taxDifference > 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  const savingsText = taxDifference > 0 ? 'Tax Savings' : 'Tax Underpayment';
  const SavingsIcon = taxDifference > 0 ? TrendingUp : TrendingDown;

  // FIX: Wrap formatCurrency in an arrow function to explicitly pass only the value (amount).
  const yAxisLabels = [maxAmount, maxAmount * 0.75, maxAmount * 0.5, maxAmount * 0.25, 0].map(amount => formatCurrency(amount));

  return (
    <div className="flex flex-col gap-4 h-full">
        <Card className="p-6 h-[400px] flex flex-col shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Approved Expenses: Last 12 Months</h3>
            
            <div className="flex flex-1 overflow-x-auto">
                
                <div className="flex flex-col justify-between pr-4 h-full text-xs text-gray-500">
                    {yAxisLabels.map((label, index) => (
                        <div key={index} className="h-[25px] flex items-center justify-end">
                            {label}
                        </div>
                    ))}
                </div>

                <div className="flex-1 flex flex-col justify-end relative">
                    <div className="absolute inset-0 flex flex-col justify-between pb-8 pt-1">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-full h-px bg-gray-200"></div>
                        ))}
                    </div>

                    <div className="flex items-end justify-around space-x-4 h-full relative z-10 pt-4">
                        {monthlyData.map(({ month, totalApprovedAmount }) => (
                            <div key={month} className="flex flex-col items-center justify-end h-full group w-1/12 min-w-[50px]">
                                
                                <div 
                                    className="w-full bg-primary-500 rounded-t-md transition-all duration-300 hover:bg-primary-600 relative shadow-md"
                                    style={{ height: `${(totalApprovedAmount / maxAmount) * 80}%` }}
                                >
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 p-2 text-xs text-white bg-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                        {formatCurrency(totalApprovedAmount)}
                                    </div>
                                </div>
                                
                                <span className="mt-2 text-xs font-medium text-gray-600 max-w-full truncate">{month.substring(0, 3)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>

        <Card className={`p-6 space-y-4 shadow-lg ${savingsClass}`}>
            <div className="flex justify-between items-center pb-2">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <SavingsIcon className={`w-6 h-6 ${taxDifference > 0 ? 'text-green-700' : 'text-red-700'}`} />
                    Tax Impact Summary ({taxSummary.taxYear})
                </h2>
            </div>
            
            <div className="grid grid-cols-3 gap-4 border-t border-gray-200 pt-4">
                <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Probable Tax (AI Estimate)</span>
                    <span className="text-xl font-bold text-gray-900">{formatCurrency(taxSummary.probableTax)}</span>
                </div>

                <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Actual Tax Liability</span>
                    <span className="text-xl font-bold text-gray-900">{formatCurrency(taxSummary.actualTax)}</span>
                </div>

                <div className="flex flex-col justify-center items-end">
                    <span className="text-base font-semibold text-gray-700">{savingsText}</span>
                    <span className={`text-3xl font-extrabold ${taxDifference > 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {formatCurrency(Math.abs(taxDifference))}
                    </span>
                </div>
            </div>
        </Card>
    </div>
  );
};

export default ExpensesMonthlyBarChart;