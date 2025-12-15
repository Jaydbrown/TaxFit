import React from 'react';
import { DollarSign, Zap, ArrowRight } from 'lucide-react';
import Card from '@/components/common/Card'; 
import { formatCurrency } from '@/utils/helpers'; 

interface Recommendation {
  id: number;
  area: string;
  suggestion: string;
  potentialSavings: number;
}

interface ExpenseOptimizationProps {
    recommendations: Recommendation[];
}

const ExpenseOptimizationSuggestions: React.FC<ExpenseOptimizationProps> = ({ recommendations }) => {
    const totalSavings = recommendations.reduce((sum, rec) => sum + rec.potentialSavings, 0);

    return (
        <Card className="p-6 bg-white shadow-xl h-full flex flex-col">
            <div className="flex items-center text-primary-600 mb-4">
                <Zap className="w-6 h-6 mr-2" />
                <h2 className="text-xl font-bold">Optimization Insights</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
                Based on your historical spending, We have identified key areas for tax savings and expense reduction.
            </p>

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

            <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-700">Total Potential Annual Savings:</span>
                    <span className="text-2xl font-extrabold text-green-700">{formatCurrency(totalSavings)}</span>
                </div>
            </div>
        </Card>
    );
};

export default ExpenseOptimizationSuggestions;