// src/hooks/analytics/use-ai-analytics.ts

import { useQuery } from '@tanstack/react-query';
import apiClient, { handleApiError } from '@/lib/api-client';
import type { ApiError, ApiResponse } from '@/types'; 

// --- 1. Optimization Types (from previous fix) ---

export interface OptimizationRecommendation {
  id: number;
  area: string;
  suggestion: string;
  potentialSavings: number;
}

// 🎯 FIX 1A: Define the payload structure for the Optimization response
type OptimizationPayload = {
    recommendations: OptimizationRecommendation[];
    totalSavings: number;
};

// 🎯 FIX 1B: Remove the conflicting interface definition (we'll use ApiResponse<T> directly)
// interface ExpenseOptimizationResponse extends ApiResponse<void> { ... }


// --- 2. Expense Summary Types (NEW) ---

export interface ExpenseSummary {
    totalExpenses: number;
    approvedDeductibleAmount: number;
    pendingReviewCount: number;
}
// 🎯 FIX 2: Remove the conflicting interface definition
// interface ExpenseSummaryResponse extends ApiResponse<void> { ... }


// --- 3. Monthly Expenses Types (NEW) ---

export interface MonthlyExpense {
    month: string; // e.g., "Jan 2025"
    totalApprovedAmount: number;
}
// 🎯 FIX 3: Remove the conflicting interface definition
// interface MonthlyExpensesResponse extends ApiResponse<void> { ... }


// --- 4. Expense Anomaly Types (NEW) ---

export interface ExpenseAnomaly {
    id: string;
    expenseTitle: string;
    amount: number;
    date: string;
    reason: string; // e.g., "Amount significantly higher than average for this category."
}
// 🎯 FIX 4: Remove the conflicting interface definition
// interface ExpenseAnomaliesResponse extends ApiResponse<void> { ... }


// ====================================================================
// A. AI OPTIMIZATION INSIGHTS (Query)
// ====================================================================
/**
 * Hook to fetch AI-powered expense optimization insights.
 * POST /api/v1/ai/expenses/optimize
 */
export function useOptimizeExpenses() {
    return useQuery<OptimizationPayload, ApiError>({
        queryKey: ['aiOptimizationInsights'],
        queryFn: async () => {
            // 🎯 FIX 1C: Use ApiResponse<OptimizationPayload> directly
            const response = await apiClient.post<ApiResponse<OptimizationPayload>>('/ai/expenses/optimize');
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000, 
        refetchOnWindowFocus: false, 
    });
}

// ====================================================================
// B. EXPENSE SUMMARY CARDS (NEW)
// ====================================================================

/**
 * Hook to get aggregated expense summary data for cards.
 * GET /api/v1/analytics/expenses/summary
 */
export function useExpenseSummary() {
    return useQuery<ExpenseSummary, ApiError>({
        queryKey: ['expenseSummary'],
        queryFn: async () => {
            // 🎯 FIX 2: Use ApiResponse<ExpenseSummary> directly
            const response = await apiClient.get<ApiResponse<ExpenseSummary>>('/analytics/expenses/summary');
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000,
    });
}


// ====================================================================
// C. MONTHLY APPROVED EXPENSES (NEW)
// ====================================================================

/**
 * Hook to get monthly approved expense totals for charts.
 * GET /api/v1/analytics/expenses/monthly
 */
export function useMonthlyExpenses() {
    return useQuery<MonthlyExpense[], ApiError>({
        queryKey: ['monthlyExpenses'],
        queryFn: async () => {
            // 🎯 FIX 3: Use ApiResponse<MonthlyExpense[]> directly
            const response = await apiClient.get<ApiResponse<MonthlyExpense[]>>('/analytics/expenses/monthly');
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000,
    });
}

// ====================================================================
// D. EXPENSE ANOMALIES (NEW)
// ====================================================================

/**
 * Hook to detect and fetch unusual expense patterns.
 * POST /api/v1/ai/expenses/anomalies
 */
export function useExpenseAnomalies() {
    return useQuery<ExpenseAnomaly[], ApiError>({
        queryKey: ['expenseAnomalies'],
        queryFn: async () => {
            // 🎯 FIX 4: Use ApiResponse<ExpenseAnomaly[]> directly
            const response = await apiClient.post<ApiResponse<ExpenseAnomaly[]>>('/ai/expenses/anomalies');
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}