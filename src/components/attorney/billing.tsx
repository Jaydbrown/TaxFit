import React from 'react';
import Layout from '@/components/layout/Layout';
import { DollarSign, FileText, Settings, Clock } from 'lucide-react';

export default function AttorneyBillingInvoicingPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-secondary-600" />
            Billing & Invoicing
          </h1>
          <p className="text-gray-600 mt-2">Manage rates, track billable hours, and generate invoices for clients.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Hourly Rate */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <Settings className="w-6 h-6 text-gray-500" />
              Current Rate
            </h2>
            <p className="text-gray-500 mt-2 text-4xl font-bold">₦50,000</p>
            <p className="text-sm text-gray-500 mt-1">Per Hour (Click to modify)</p>
          </div>

          {/* Card 2: Unbilled Hours */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary-600" />
              Unbilled Hours
            </h2>
            <p className="text-gray-500 mt-2 text-4xl font-bold">4.5 hrs</p>
            <p className="text-sm text-gray-500 mt-1">Ready for next invoice cycle.</p>
          </div>
          
          {/* Card 3: Generate Invoice */}
          <div className="bg-secondary-50 p-6 rounded-xl shadow-lg border border-secondary-100 flex items-center justify-between">
            <div>
                <h2 className="text-xl font-semibold text-secondary-700">Generate New</h2>
                <p className="text-sm text-secondary-600 mt-1">Create an invoice for a client.</p>
            </div>
            <FileText className="w-8 h-8 text-secondary-400" />
          </div>
        </div>

        <div className="mt-10 p-6 bg-white rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Invoice History (Placeholder)</h3>
            <p className="text-sm text-gray-500">
                Table for sent, paid, and overdue invoices will be displayed here.
            </p>
            <p className="text-xs text-gray-400 mt-4">Current Path: /attorney/billing</p>
        </div>
      </div>
    </Layout>
  );
}