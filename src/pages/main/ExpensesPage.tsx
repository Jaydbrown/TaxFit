import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Edit, Trash2, Calendar, DollarSign } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Modal from '@/components/common/Modal';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { formatCurrency, formatDate } from '@/utils/helpers';
import Layout from '@/components/layout/Layout';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  receiptUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
}

const mockExpenses: Expense[] = [
  {
    id: '1',
    title: 'Office Supplies',
    amount: 15000,
    category: 'Office',
    date: '2024-01-15',
    status: 'approved',
    description: 'Printer paper and ink cartridges',
  },
  {
    id: '2',
    title: 'Client Lunch',
    amount: 25000,
    category: 'Meals',
    date: '2024-01-14',
    status: 'pending',
    description: 'Business lunch with potential client',
  },
  {
    id: '3',
    title: 'Software License',
    amount: 50000,
    category: 'Technology',
    date: '2024-01-10',
    status: 'approved',
    description: 'Annual subscription renewal',
  },
];

export default function ExpensesPage() {
  const [expenses] = useState<Expense[]>(mockExpenses);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const approvedExpenses = expenses.filter(e => e.status === 'approved').length;
  const pendingExpenses = expenses.filter(e => e.status === 'pending').length;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Expenses</h1>
            <p className="text-gray-600">Track and manage your business expenses</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm mb-1">Total Expenses</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(totalExpenses)}
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
                  <div className="text-gray-600 text-sm mb-1">Approved</div>
                  <div className="text-2xl font-bold text-green-600">{approvedExpenses}</div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm mb-1">Pending</div>
                  <div className="text-2xl font-bold text-yellow-600">{pendingExpenses}</div>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Actions Bar */}
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search expenses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
                  Filter
                </Button>
                <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
                  Export
                </Button>
                <Button
                  onClick={() => setShowAddModal(true)}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add Expense
                </Button>
              </div>
            </div>
          </Card>

          {/* Expenses List */}
          <Card>
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
                    <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
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
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Add Expense Modal */}
          <Modal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            title="Add New Expense"
          >
            <div className="space-y-4">
              <Input label="Title" placeholder="Enter expense title" />
              <Input type="number" label="Amount" placeholder="0.00" />
              <Select
                label="Category"
                options={[
                  { value: 'office', label: 'Office' },
                  { value: 'meals', label: 'Meals' },
                  { value: 'technology', label: 'Technology' },
                  { value: 'travel', label: 'Travel' },
                  { value: 'other', label: 'Other' },
                ]}
              />
              <Input type="date" label="Date" />
              <Input label="Description" placeholder="Optional description" />
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowAddModal(false)}>
                  Add Expense
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </Layout>
  );
}