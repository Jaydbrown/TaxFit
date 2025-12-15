
import React from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import { Users, FolderOpen, MessageSquare, Search, FileText } from 'lucide-react';

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

        {/* Client Stats & Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

          <Card className="bg-red-50 border border-red-100 flex items-center justify-between">
            <div>
                <h2 className="text-xl font-semibold text-red-700">Document Upload</h2>
                <p className="text-sm text-red-600 mt-1">Upload files to a case.</p>
            </div>
            <FileText className="w-8 h-8 text-red-400" />
          </Card>
        </div>

        {/* Main Content Area: Client/Case List */}
        <div className="mt-10 p-6 bg-white rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Client List</h3>
            
            {/* Search and Filter Bar Placeholder */}
            <div className="mb-6 p-4 border rounded-lg bg-gray-50 flex items-center justify-between">
                <input 
                    type="text" 
                    placeholder="Search by client name or case ID..." 
                    className="w-1/2 p-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
                <select className="p-2 border rounded-lg">
                    <option>Filter by Status: All</option>
                    <option>Status: Active</option>
                    <option>Status: Pending Review</option>
                    <option>Status: Closed</option>
                </select>
            </div>

            {/* Data Table Placeholder */}
            <p className="text-sm text-gray-500 py-12 text-center border border-dashed rounded">
                **Client List Data Table**<br/>
                (Name, Case ID, Status, Last Activity, View Details Button will appear here)
            </p>
        </div>
      </div>
    </Layout>
  );
}