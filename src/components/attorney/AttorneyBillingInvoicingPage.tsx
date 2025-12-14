import Card from '../common/Card';
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Users, FolderOpen, MessageSquare, Search } from 'lucide-react';

export default function AttorneyClientPortalPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary-600" />
            Client & Case Portal
          </h1>
          <p className="text-gray-600 mt-2">Manage all active and prospective client interactions and legal matters.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-2">
              <FolderOpen className="w-5 h-5 text-secondary-600" /> Active Cases
            </h2>
            <p className="text-4xl font-bold text-secondary-600">12</p>
            <p className="text-sm text-gray-500 mt-1">Cases currently open.</p>
          </Card>

          <Card className="shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-green-600" /> Unread Messages
            </h2>
            <p className="text-4xl font-bold text-green-600">3</p>
            <p className="text-sm text-gray-500 mt-1">Pending client communication.</p>
          </Card>
          
          <Card className="bg-primary-50 border border-primary-100 flex items-center justify-between">
            <div>
                <h2 className="text-xl font-semibold text-primary-700">Client Search</h2>
                <p className="text-sm text-primary-600 mt-1">Find clients and review history quickly.</p>
            </div>
            <Search className="w-8 h-8 text-primary-400" />
          </Card>
        </div>

        <div className="mt-10 p-6 bg-white rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Client List</h3>
            <p className="text-sm text-gray-500 py-12 text-center border border-dashed rounded">
                Placeholder: Client list data table with filters and case status will load here.
            </p>
        </div>
      </div>
    </Layout>
  );
}