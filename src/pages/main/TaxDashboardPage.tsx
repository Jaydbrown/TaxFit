import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import TaxCalculator from '@/components/tax/TaxCalculator';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Download,
  Calendar,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { formatNaira, NIGERIAN_VAT_RATE } from '@/lib/tax-calculator';

export default function TaxDashboardPage() {
  const [showCalculator, setShowCalculator] = useState(false);

  // Mock data - replace with actual data from your API
  const taxSummary = {
    estimatedAnnualTax: 1250000,
    paidToDate: 625000,
    nextPaymentDue: '2024-03-31',
    nextPaymentAmount: 312500,
  };

  const taxDeadlines = [
    { date: '2024-03-31', description: 'Q1 Tax Payment', amount: 312500, status: 'upcoming' },
    { date: '2024-06-30', description: 'Q2 Tax Payment', amount: 312500, status: 'upcoming' },
    { date: '2024-09-30', description: 'Q3 Tax Payment', amount: 312500, status: 'upcoming' },
    { date: '2024-12-31', description: 'Q4 Tax Payment', amount: 312500, status: 'upcoming' },
  ];

  const taxTips = [
    {
      icon: DollarSign,
      title: 'Keep Track of Deductions',
      description: 'Document all business expenses and allowable deductions to reduce your taxable income.',
    },
    {
      icon: Calendar,
      title: 'Pay on Time',
      description: 'Avoid penalties by making quarterly tax payments before the deadline.',
    },
    {
      icon: FileText,
      title: 'Maintain Records',
      description: 'Keep all receipts, invoices, and tax documents for at least 6 years.',
    },
    {
      icon: CheckCircle,
      title: 'File Accurately',
      description: 'Double-check all information before submitting your tax returns to FIRS.',
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 mb-2">Tax Dashboard</h1>
            <p className="text-gray-600">
              Manage your taxes and stay compliant with Nigerian tax regulations
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Estimated Annual Tax</span>
                <Calculator className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatNaira(taxSummary.estimatedAnnualTax)}
              </div>
              <div className="text-xs text-gray-500 mt-1">For current year</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Paid to Date</span>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-700">
                {formatNaira(taxSummary.paidToDate)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {((taxSummary.paidToDate / taxSummary.estimatedAnnualTax) * 100).toFixed(0)}% of total
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Next Payment</span>
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-700">
                {formatNaira(taxSummary.nextPaymentAmount)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Due {taxSummary.nextPaymentDue}</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Current VAT Rate</span>
                <TrendingUp className="w-5 h-5 text-primary-600" />
              </div>
              <div className="text-2xl font-bold text-primary-700">
                {(NIGERIAN_VAT_RATE * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">Nigerian VAT</div>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Calculator and Deadlines */}
            <div className="lg:col-span-2 space-y-8">
              {/* Tax Calculator */}
              <div>
                {!showCalculator ? (
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-medium text-gray-900 mb-1">Tax Calculator</h2>
                        <p className="text-sm text-gray-600">
                          Calculate VAT, income tax, and other taxes
                        </p>
                      </div>
                      <Calculator className="w-8 h-8 text-primary-600" />
                    </div>
                    <Button onClick={() => setShowCalculator(true)} className="w-full">
                      Open Tax Calculator
                    </Button>
                  </Card>
                ) : (
                  <div>
                    <TaxCalculator />
                    <Button
                      onClick={() => setShowCalculator(false)}
                      variant="outline"
                      className="mt-4 w-full"
                    >
                      Close Calculator
                    </Button>
                  </div>
                )}
              </div>

              {/* Upcoming Deadlines */}
              <Card>
                <div className="border-b border-gray-200 p-6">
                  <h2 className="text-xl font-medium text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    Tax Payment Schedule
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {taxDeadlines.map((deadline, index) => (
                    <div key={index} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{deadline.description}</div>
                          <div className="text-sm text-gray-600">Due: {deadline.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatNaira(deadline.amount)}
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mt-1">
                          {deadline.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column - Tips and Resources */}
            <div className="space-y-8">
              {/* Tax Tips */}
              <Card>
                <div className="border-b border-gray-200 p-6">
                  <h2 className="text-xl font-medium text-gray-900 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-primary-600" />
                    Tax Tips
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {taxTips.map((tip, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <tip.icon className="w-5 h-5 text-primary-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">{tip.title}</h3>
                        <p className="text-sm text-gray-600">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card>
                <div className="border-b border-gray-200 p-6">
                  <h2 className="text-xl font-medium text-gray-900">Quick Actions</h2>
                </div>
                <div className="p-6 space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    View Tax Documents
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Tax Report
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calculator className="w-4 h-4 mr-2" />
                    Estimate Next Year
                  </Button>
                </div>
              </Card>

              {/* Tax Information */}
              <Card className="bg-blue-50 border-blue-200">
                <div className="p-6">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-900 mb-2">Important Information</h3>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• VAT is currently 15% in Nigeria</li>
                        <li>• Income tax rates range from 7% to 24%</li>
                        <li>• Company tax is 30% (20% for small companies)</li>
                        <li>• File your taxes with FIRS before deadlines</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}