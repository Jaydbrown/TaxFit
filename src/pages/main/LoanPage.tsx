import React, { useState } from 'react';
import { Plus, DollarSign, Calendar, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { formatCurrency, formatDate } from '@/utils/helpers';

interface Loan {
  id: string;
  amount: number;
  purpose: string;
  term: number; // months
  interestRate: number;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  appliedDate: string;
  monthlyPayment?: number;
}

const loanPurposes = [
  { value: 'expansion', label: 'Business Expansion' },
  { value: 'equipment', label: 'Equipment Purchase' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'working-capital', label: 'Working Capital' },
  { value: 'other', label: 'Other' },
];

const loanTerms = [
  { value: '6', label: '6 Months' },
  { value: '12', label: '12 Months' },
  { value: '24', label: '24 Months' },
  { value: '36', label: '36 Months' },
];

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([
    {
      id: '1',
      amount: 500000,
      purpose: 'expansion',
      term: 12,
      interestRate: 15,
      status: 'approved',
      appliedDate: '2024-01-10',
      monthlyPayment: 45000,
    },
    {
      id: '2',
      amount: 250000,
      purpose: 'equipment',
      term: 6,
      interestRate: 12,
      status: 'pending',
      appliedDate: '2024-01-25',
    },
  ]);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    term: '',
    businessRevenue: '',
    employeeCount: '',
  });

  const handleApplyLoan = () => {
    const newLoan: Loan = {
      id: Date.now().toString(),
      amount: parseFloat(formData.amount),
      purpose: formData.purpose,
      term: parseInt(formData.term),
      interestRate: 15,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
    };
    
    setLoans([newLoan, ...loans]);
    setIsApplyModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      purpose: '',
      term: '',
      businessRevenue: '',
      employeeCount: '',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success" leftIcon={<CheckCircle className="w-4 h-4" />}>Approved</Badge>;
      case 'pending':
        return <Badge variant="warning" leftIcon={<Clock className="w-4 h-4" />}>Pending</Badge>;
      case 'rejected':
        return <Badge variant="danger" leftIcon={<XCircle className="w-4 h-4" />}>Rejected</Badge>;
      case 'disbursed':
        return <Badge variant="info">Disbursed</Badge>;
      default:
        return null;
    }
  };

  const totalLoanAmount = loans.filter(l => l.status === 'approved' || l.status === 'disbursed').reduce((sum, loan) => sum + loan.amount, 0);
  const activeLoans = loans.filter(l => l.status === 'approved' || l.status === 'disbursed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Loans</h1>
            <p className="text-gray-600 mt-1">Apply for and manage your business loans</p>
          </div>
          <Button leftIcon={<Plus className="w-5 h-5" />} onClick={() => setIsApplyModalOpen(true)}>
            Apply for Loan
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-sm mb-1">Total Loans</div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalLoanAmount)}</div>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-sm mb-1">Active Loans</div>
                <div className="text-2xl font-bold text-gray-900">{activeLoans}</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-sm mb-1">Applications</div>
                <div className="text-2xl font-bold text-gray-900">{loans.length}</div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Loans List */}
        {loans.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Loans</h3>
              <p className="text-gray-600 mb-4">Apply for a loan to grow your business</p>
              <Button onClick={() => setIsApplyModalOpen(true)}>
                Apply for Your First Loan
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {loans.map((loan) => (
              <Card key={loan.id} hover>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold capitalize">
                        {loanPurposes.find(p => p.value === loan.purpose)?.label}
                      </h3>
                      {getStatusBadge(loan.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <div className="text-sm text-gray-600">Amount</div>
                        <div className="font-semibold">{formatCurrency(loan.amount)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Term</div>
                        <div className="font-semibold">{loan.term} months</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Interest Rate</div>
                        <div className="font-semibold">{loan.interestRate}% p.a.</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Applied Date</div>
                        <div className="font-semibold">{formatDate(loan.appliedDate)}</div>
                      </div>
                    </div>

                    {loan.monthlyPayment && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <div className="text-sm text-green-800">
                          Monthly Payment: <span className="font-bold">{formatCurrency(loan.monthlyPayment)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Modal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          title="Apply for a Loan"
          size="lg"
        >
          <div className="space-y-4">
            <Input
              label="Loan Amount (₦)"
              type="number"
              placeholder="500000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              helperText="Minimum: ₦100,000 | Maximum: ₦5,000,000"
            />

            <Select
              label="Purpose of Loan"
              options={loanPurposes}
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            />

            <Select
              label="Loan Term"
              options={loanTerms}
              value={formData.term}
              onChange={(e) => setFormData({ ...formData, term: e.target.value })}
            />

            <Input
              label="Annual Business Revenue (₦)"
              type="number"
              placeholder="1000000"
              value={formData.businessRevenue}
              onChange={(e) => setFormData({ ...formData, businessRevenue: e.target.value })}
            />

            <Input
              label="Number of Employees"
              type="number"
              placeholder="5"
              value={formData.employeeCount}
              onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
            />

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Loan Requirements</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Business must be registered</li>
                <li>✓ Minimum 6 months of operation</li>
                <li>✓ Valid tax identification number</li>
                <li>✓ Bank statements (last 6 months)</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button fullWidth variant="outline" onClick={() => setIsApplyModalOpen(false)}>
                Cancel
              </Button>
              <Button fullWidth onClick={handleApplyLoan}>
                Submit Application
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}