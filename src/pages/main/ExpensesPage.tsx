// src/pages/expenses/ExpensesPage.tsx

import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Download, Edit, Trash2, Calendar, DollarSign, Loader2, Zap, AlertTriangle } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Modal from '@/components/common/Modal';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { formatCurrency, formatDate } from '@/utils/helpers';
import Layout from '@/components/layout/Layout';
import { toast } from 'react-hot-toast';

// 🎯 Analytics Imports
import { 
    useExpenseSummary, 
    useMonthlyExpenses 
} from '@/hooks/analytics/use-ai-analytics';
import ExpenseOptimizationSuggestions from '@/components/charts/ExpenseOptimizationSuggestions'; 
import ExpenseAnomaliesCard from '@/components/charts/ExpenseAnomaliesCard';

// Expense Imports
import { 
    useGetExpenses, 
    useCreateExpense, 
    useUpdateExpense, 
    useDeleteExpense,
    Expense,
    ExpenseInput
} from '@/hooks/expenses/use-expense-management'; 

// Components we assume are implemented:
import ExpensesMonthlyBarChart from '@/components/charts/ExpensesMonthlyBarChart'; 

// Define simplified mock structure needed only for the chart component props
interface TaxData { probableTax: number; actualTax: number; taxYear: number; }
const mockTaxData: TaxData = { taxYear: 2024, probableTax: 1250000, actualTax: 1050000 };
// -----------------------------------------------------------------------------------

// Define the state for the form (Add/Edit)
const initialExpenseState: ExpenseInput = {
    title: '',
    amount: 0,
    category: 'other', 
    date: new Date().toISOString().split('T')[0], 
    description: '',
};

export default function ExpensesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState<ExpenseInput>(initialExpenseState);

  // 🎯 NEW: Fetch Analytical Data
  const { data: summary, isLoading: isLoadingSummary } = useExpenseSummary();
  const { data: monthlyData = [], isLoading: isLoadingMonthly } = useMonthlyExpenses();

  // Fetch Transaction Data
  const { 
      data: expenses = [], 
      isLoading: isLoadingExpenses, 
      isError, 
      error,
      refetch 
  } = useGetExpenses({
      search: searchQuery,
      category: filterCategory,
      status: filterStatus,
  });

  // Mutation Hooks
  const { mutate: createExpense, isPending: isCreating } = useCreateExpense();
  const { mutate: updateExpense, isPending: isUpdating } = useUpdateExpense();
  const { mutate: deleteExpense, isPending: isDeleting } = useDeleteExpense(); 

  // --- Derived Statistics from Summary Hook (or use defaults) ---
  const totalExpenses = summary?.totalExpenses ?? 0;
  const totalApprovedAmount = summary?.approvedDeductibleAmount ?? 0;
  const pendingExpensesCount = summary?.pendingReviewCount ?? 0;
  const approvedExpensesCount = expenses.length - pendingExpensesCount; // Quick estimate if summary doesn't give this specific stat

  // --- Handlers (remain the same) ---
  const openAddModal = () => {
    setEditingExpense(null);
    setFormData(initialExpenseState);
    setShowModal(true);
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        description: expense.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
      if (window.confirm('Are you sure you want to delete this expense? This action cannot be undone.')) {
          deleteExpense(id);
      }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount || !formData.category) {
        toast.error('Title, Amount, and Category are required.');
        return;
    }

    const payload = {
        ...formData,
        amount: Number(formData.amount),
    };

    if (editingExpense) {
        updateExpense({ id: editingExpense._id, ...payload });
    } else {
        createExpense(payload);
    }

    setShowModal(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- UI Components / Mappings ---
  const categoryOptions = [
    { value: 'office', label: 'Office' },
    { value: 'meals', label: 'Meals' },
    { value: 'technology', label: 'Technology' },
    { value: 'travel', label: 'Travel' },
    { value: 'other', label: 'Other' },
  ];

  const statusOptions = [
    { value: 'approved', label: 'Approved' },
    { value: 'pending', label: 'Pending' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const currentActionPending = isCreating || isUpdating || isDeleting;

  // --- Rendering ---
  let tableContent;

  if (isLoadingExpenses) {
      tableContent = (
          <div className="text-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
              <p className="text-lg text-gray-600">Fetching your expenses...</p>
          </div>
      );
  } else if (isError) {
      tableContent = (
          <div className="text-center py-20 text-red-600">
              <p className="text-xl mb-2">Error loading expenses.</p>
              <p className="text-sm">{(error as Error)?.message}</p>
              <Button onClick={() => refetch()} className="mt-4">Try Again</Button>
          </div>
      );
  } else if (expenses.length === 0) {
      tableContent = (
          <div className="text-center py-20 text-gray-600">
              <p className="text-xl mb-2">No expenses found.</p>
              <Button onClick={openAddModal} leftIcon={<Plus className='w-4 h-4' />} className="mt-4">
                  Add Your First Expense
              </Button>
          </div>
      );
  } else {
      // Data table rendering (no changes)
      // ... (table rendering logic using expenses.map)
      tableContent = (
          <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Title</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">{expense.title}</div>
                        {expense.description && (
                          <div className="text-sm text-gray-600">{expense.description}</div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="neutral">{expense.category}</Badge>
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-900">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {formatDate(expense.date)}
                      </td>
                      <td className="px-4 py-4">
                        <Badge
                          variant={
                            expense.status === 'approved'
                              ? 'success'
                              : expense.status === 'pending'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {expense.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button 
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                            onClick={() => openEditModal(expense)}
                            disabled={currentActionPending}
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button 
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                            onClick={() => handleDelete(expense._id)}
                            disabled={currentActionPending}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
      );
  }


  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Expenses & AI Financial Dashboard</h1>
            <p className="text-gray-600">Track and manage your business expenses, visualize trends, and get AI-driven optimization advice.</p>
          </div>

          {/* AI/Chart & Optimization Section: 3-Column Grid */}
          {/* 🎯 NEW: Added Anomalies Card to this section. Total 4 sections in a 2x2 grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 h-full">
            
            {/* Chart + Anomalies (Spans 2/3 width) */}
            <div className="lg:col-span-2 grid grid-cols-1 gap-6">
                <ExpensesMonthlyBarChart 
                    monthlyData={monthlyData} // 🎯 Dynamic Data
                    taxSummary={mockTaxData}
                    isLoading={isLoadingMonthly} // Pass loading state to chart
                />
                <ExpenseAnomaliesCard /> {/* 🎯 NEW: Anomalies Card */}
            </div>
            
            {/* AI Optimization Suggestions (Spans 1/3 width) */}
            <div className="lg:col-span-1">
                <ExpenseOptimizationSuggestions />
            </div>

          </div>

          {/* Core Expense Stats (Now Dynamic using useExpenseSummary hook) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm mb-1">Total Expenses Tracked</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {isLoadingSummary ? <Loader2 className="w-6 h-6 animate-spin" /> : formatCurrency(totalExpenses)}
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm mb-1">Approved Deductible Amount</div>
                  <div className="text-2xl font-bold text-green-600">
                    {isLoadingSummary ? <Loader2 className="w-6 h-6 animate-spin" /> : formatCurrency(totalApprovedAmount)}
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm mb-1">Pending Review Count</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {isLoadingSummary ? <Loader2 className="w-6 h-6 animate-spin" /> : pendingExpensesCount}
                  </div>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </Card>
          </div>
          
          {/* ... (Rest of the component remains the same) ... */}

          <Card className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full md:w-auto">
                {/* Search Input */}
                <Input
                    type="text"
                    placeholder="Search titles or descriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="w-4 h-4" />}
                    label="Search Expenses"
                />
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                {/* Filter Selects */}
                <Select
                    label="Category"
                    options={[{ value: '', label: 'All Categories' }, ...categoryOptions]}
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    leftIcon={<Filter className="w-4 h-4" />}
                />
                <Select
                    label="Status"
                    options={[{ value: '', label: 'All Statuses' }, ...statusOptions]}
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    leftIcon={<Filter className="w-4 h-4" />}
                />
                <Button 
                    variant="outline" 
                    leftIcon={<Download className="w-4 h-4" />}
                    className="min-w-[120px] self-end"
                >
                  Export
                </Button>
                <Button
                  onClick={openAddModal}
                  leftIcon={<Plus className="w-4 h-4" />}
                  className="min-w-[120px] self-end"
                >
                  Add Expense
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            {tableContent}
          </Card>

          {/* Add/Edit Expense Modal (remains the same) */}
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={editingExpense ? "Edit Expense" : "Add New Expense"}
          >
            <form onSubmit={handleFormSubmit}>
              <div className="space-y-4">
                <Input 
                    label="Title" 
                    placeholder="Enter expense title" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                />
                <Input 
                    type="number" 
                    label="Amount" 
                    placeholder="0.00" 
                    name="amount"
                    value={formData.amount.toString()}
                    onChange={handleInputChange}
                />
                <Select
                    label="Category"
                    options={categoryOptions}
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                />
                <Input 
                    type="date" 
                    label="Date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                />
                <Input 
                    label="Description (Optional)" 
                    placeholder="Brief description" 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                />
                <div className="flex gap-3 justify-end pt-4">
                  <Button variant="outline" onClick={() => setShowModal(false)} type="button">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={currentActionPending} leftIcon={currentActionPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}>
                    {editingExpense ? 'Save Changes' : 'Add Expense'}
                  </Button>
                </div>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </Layout>
  );
}