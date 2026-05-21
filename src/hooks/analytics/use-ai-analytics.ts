// src/hooks/analytics/use-ai-analytics.ts

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import type { ApiError, ApiResponse } from '@/types'; 

// --- 1. Optimization Types ---

export interface OptimizationRecommendation {
  id: number;
  area: string;
  suggestion: string;
  potentialSavings: number;
}

type OptimizationPayload = {
    recommendations: OptimizationRecommendation[];
    totalSavings: number;
};

// --- 2. Expense Summary Types ---

export interface ExpenseSummary {
    totalExpenses: number;
    approvedDeductibleAmount: number;
    pendingReviewCount: number;
}

// --- 3. Monthly Expenses Types ---

export interface MonthlyExpense {
    month: string; // e.g., "Jan 2025"
    totalApprovedAmount: number;
}

// --- 4. Expense Anomaly Types ---

export interface ExpenseAnomaly {
    id: string;
    expenseTitle: string;
    amount: number;
    date: string;
    reason: string;
}

// ====================================================================
// A. AI OPTIMIZATION INSIGHTS (Query) - WITH ERROR HANDLING
// ====================================================================
/**
 * Hook to fetch AI-powered expense optimization insights.
 * POST /api/v1/ai/expenses/optimize
 */
export function useOptimizeExpenses() {
    return useQuery<OptimizationPayload, ApiError>({
        queryKey: ['aiOptimizationInsights'],
        queryFn: async () => {
            try {
                const response = await apiClient.post<ApiResponse<OptimizationPayload>>('/ai/expenses/optimize');
                return response.data.data;
            } catch (error: any) {
                console.error('❌ AI Optimization Error:', error);
                
                // Handle 500 Internal Server Error
                if (error.response?.status === 500) {
                    const errorMessage = error.response?.data?.message || error.response?.data?.error;
                    
                    // Check if it's an API configuration issue
                    if (errorMessage?.includes('API key') || 
                        errorMessage?.includes('not configured') ||
                        errorMessage?.includes('OpenAI')) {
                        throw new Error('AI optimization service is not configured yet. This feature is coming soon!');
                    }
                    
                    // Generic 500 error
                    throw new Error('AI optimization service is temporarily unavailable. Please try again later.');
                }
                
                // Handle 404 Not Found
                if (error.response?.status === 404) {
                    throw new Error('AI optimization feature is not available yet. This feature is coming soon!');
                }
                
                // Handle network errors
                if (!error.response) {
                    throw new Error('Unable to connect to the server. Please check your internet connection.');
                }
                
                // Re-throw other errors with helpful message
                throw new Error(error.response?.data?.message || 'Failed to fetch optimization insights.');
            }
        },
        staleTime: 5 * 60 * 1000, 
        refetchOnWindowFocus: false,
        retry: false, // Don't retry on errors (500 errors won't be fixed by retrying)
    });
}

// ====================================================================
// B. EXPENSE SUMMARY CARDS - WITH ERROR HANDLING
// ====================================================================

/**
 * Hook to get aggregated expense summary data for cards.
 * GET /api/v1/analytics/expenses/summary
 */
export function useExpenseSummary() {
    return useQuery<ExpenseSummary, ApiError>({
        queryKey: ['expenseSummary'],
        queryFn: async () => {
            try {
                const response = await apiClient.get<ApiResponse<ExpenseSummary>>('/analytics/expenses/summary');
                return response.data.data;
            } catch (error: any) {
                // If endpoint doesn't exist, return default data
                if (error.response?.status === 404 || error.response?.status === 500) {
                    console.log('ℹ️ Expense summary endpoint not available, using defaults');
                    return {
                        totalExpenses: 0,
                        approvedDeductibleAmount: 0,
                        pendingReviewCount: 0,
                    };
                }
                throw error;
            }
        },
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
}

// ====================================================================
// C. MONTHLY APPROVED EXPENSES - WITH ERROR HANDLING
// ====================================================================

/**
 * Hook to get monthly approved expense totals for charts.
 * GET /api/v1/analytics/expenses/monthly
 */
export function useMonthlyExpenses() {
    return useQuery<MonthlyExpense[], ApiError>({
        queryKey: ['monthlyExpenses'],
        queryFn: async () => {
            try {
                const response = await apiClient.get<ApiResponse<MonthlyExpense[]>>('/analytics/expenses/monthly');
                return response.data.data;
            } catch (error: any) {
                // If endpoint doesn't exist, return empty array
                if (error.response?.status === 404 || error.response?.status === 500) {
                    console.log('ℹ️ Monthly expenses endpoint not available, using empty data');
                    return [];
                }
                throw error;
            }
        },
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
}

// ====================================================================
// D. EXPENSE ANOMALIES - WITH ERROR HANDLING
// ====================================================================

/**
 * Hook to detect and fetch unusual expense patterns.
 * POST /api/v1/ai/expenses/anomalies
 */
export function useExpenseAnomalies() {
    return useQuery<ExpenseAnomaly[], ApiError>({
        queryKey: ['expenseAnomalies'],
        queryFn: async () => {
            try {
                const response = await apiClient.post<ApiResponse<ExpenseAnomaly[]>>('/ai/expenses/anomalies');
                return response.data.data;
            } catch (error: any) {
                console.error('❌ Expense Anomalies Error:', error);
                
                // Handle 500/404 errors gracefully
                if (error.response?.status === 500 || error.response?.status === 404) {
                    const errorMessage = error.response?.data?.message;
                    
                    if (errorMessage?.includes('AI') || errorMessage?.includes('not configured')) {
                        throw new Error('Anomaly detection is not available yet. This feature is coming soon!');
                    }
                    
                    // Return empty array for development
                    console.log('ℹ️ Anomaly detection not available, returning empty data');
                    return [];
                }
                
                throw error;
            }
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: false,
    });
}