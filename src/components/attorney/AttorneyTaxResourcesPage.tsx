
import React from 'react';
import Layout from '@/components/layout/Layout';
import { BookOpen, FileText, Globe, Search, Bell } from 'lucide-react';
import Card from '@/components/common/Card';

export default function AttorneyTaxResourcesPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-green-600" />
            Tax Law Resources
          </h1>
          <p className="text-gray-600 mt-2">Access the latest Nigerian tax legislation, circulars, and industry news.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 1: Latest Updates */}
          <Card className="shadow-lg border border-gray-100 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
              <Bell className="w-5 h-5 text-red-500" />
              Recent Regulatory Updates
            </h2>
            <ul className="space-y-3">
                <li className="p-3 border-l-4 border-red-400 bg-red-50 rounded-r">
                    <p className="font-medium text-sm">FIRS Circular on Digital Assets Tax Treatment (New)</p>
                    <p className="text-xs text-gray-500 mt-1">Published: Dec 1, 2025</p>
                </li>
                <li className="p-3 border-l-4 border-blue-400 bg-blue-50 rounded-r">
                    <p className="font-medium text-sm">Review of the Finance Act 2025 - Key Amendments</p>
                    <p className="text-xs text-gray-500 mt-1">Published: Nov 28, 2025</p>
                </li>
                <li className="p-3 border-l-4 border-gray-400 bg-gray-50 rounded-r">
                    <p className="font-medium text-sm">State V.A.T. Remittance Procedures (Edo State)</p>
                    <p className="text-xs text-gray-500 mt-1">Published: Oct 15, 2025</p>
                </li>
            </ul>
          </Card>

          {/* Section 2: Reference Tools */}
          <Card className="shadow-lg border border-gray-100 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
              <Globe className="w-5 h-5 text-blue-500" />
              Reference Tools & Databases
            </h2>
            <div className="space-y-3">
                <a href="#" className="block px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <p className="font-medium">Nigerian Tax Code Database</p>
                    <p className="text-sm text-gray-600">Searchable repository of all legislation.</p>
                </a>
                <a href="#" className="block px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <p className="font-medium">Tax Appeals Tribunal Case Law Index</p>
                    <p className="text-sm text-gray-600">Access key judicial decisions.</p>
                </a>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}