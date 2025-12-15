// src/hooks/expenses/use-expense-management.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient, { handleApiError } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
// 🎯 FIX 1: Ensure ApiResponse is imported.
import type { AuthResponse, ApiError, ApiResponse } from '@/types'; 

// --- Core Expense Type (Matching your interface) ---
export interface Expense {
    _id: string; // Changed from 'id' to '_id' for typical MongoDB API response
    title: string;
    amount: number;
    category: string;
    date: string; // ISO 8601 date string
    description?: string;
    status: 'pending' | 'approved' | 'rejected';
}

// --- API Request/Response Types ---

// Data for creating/updating an expense (excluding API-generated fields)
export type ExpenseInput = Omit<Expense, '_id' | 'status'>;

// 🎯 FIX 2 & 3: These interfaces are now redundant and can be removed:
// interface ExpenseListResponse extends ApiResponse<Expense[]> {}
// interface ExpenseSingleResponse extends ApiResponse<Expense> {}


// ====================================================================
// A. GET EXPENSES (Query)
// ====================================================================

interface ExpensesQueryVariables {
    search?: string;
    category?: string;
    status?: string;
}

/**
 * Hook to retrieve a list of all expenses for the authenticated user.
 * GET /api/v1/expenses
 */
export function useGetExpenses(filters: ExpensesQueryVariables) {
    return useQuery<Expense[], ApiError>({
        queryKey: ['expenses', filters],
        queryFn: async () => {
            // 🎯 FIX: Used ApiResponse<Expense[]> directly in apiClient call
            const response = await apiClient.get<ApiResponse<Expense[]>>('/expenses', { 
                params: filters 
            });
            // NOTE: Must return the inner data payload to match the useQuery generic type (Expense[])
            return response.data.data;
        },
        staleTime: 60 * 1000, // 1 minute stale time
    });
}


// ====================================================================
// B. CREATE EXPENSE (Mutation)
// ====================================================================

/**
 * Hook to create a new expense.
 * POST /api/v1/expenses
 */
export function useCreateExpense() {
    const queryClient = useQueryClient();

    return useMutation<Expense, ApiError, ExpenseInput>({
        mutationFn: async (data) => {
            // 🎯 FIX: Used ApiResponse<Expense> directly in apiClient call
            const response = await apiClient.post<ApiResponse<Expense>>('/expenses', data);
            return response.data.data; // Return the inner Expense object
        },
        onSuccess: (response) => {
            // response is now the Expense object
            toast.success('Expense successfully added!'); 
            queryClient.invalidateQueries({ queryKey: ['expenses'] }); 
        },
        onError: (error) => {
            toast.error(handleApiError(error) ?? 'Failed to add expense.');
        },
    });
}

// ====================================================================
// C. UPDATE EXPENSE (Mutation)
// ====================================================================

interface UpdateExpenseVariables extends ExpenseInput {
    id: string;
}

/**
 * Hook to update an existing expense.
 * PUT /api/v1/expenses/{id}
 */
export function useUpdateExpense() {
    const queryClient = useQueryClient();

    return useMutation<Expense, ApiError, UpdateExpenseVariables>({
        mutationFn: async ({ id, ...data }) => {
            // 🎯 FIX: Used ApiResponse<Expense> directly in apiClient call
            const response = await apiClient.put<ApiResponse<Expense>>(`/expenses/${id}`, data);
            return response.data.data; // Return the inner Expense object
        },
        onSuccess: (response) => {
            toast.success('Expense successfully updated!');
            queryClient.invalidateQueries({ queryKey: ['expenses'] }); 
        },
        onError: (error) => {
            toast.error(handleApiError(error) ?? 'Failed to update expense.');
        },
    });
}

// ====================================================================
// D. DELETE EXPENSE (Mutation)
// ====================================================================

/**
 * Hook to delete an expense.
 * DELETE /api/v1/expenses/{id}
 */
export function useDeleteExpense() {
    const queryClient = useQueryClient();

    // The mutation returns the AuthResponse wrapper, which has a message/status.
    // NOTE: We keep AuthResponse here as its structure is specifically used for the success message access in onSuccess.
    return useMutation<AuthResponse, ApiError, string>({ 
        mutationFn: async (id) => {
            const response = await apiClient.delete<AuthResponse>(`/expenses/${id}`);
            return response.data;
        },
        onSuccess: (response) => {
            toast.success(response.message || 'Expense successfully deleted.');
            queryClient.invalidateQueries({ queryKey: ['expenses'] }); 
        },
        onError: (error) => {
            toast.error(handleApiError(error) ?? 'Failed to delete expense.');
        },
    });
}