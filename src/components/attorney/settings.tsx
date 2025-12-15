import React from 'react';
import Layout from '@/components/layout/Layout';
import { UserCheck, Star, Edit, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AttorneyProfileSettingsPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-purple-600" />
            Public Profile & Settings
          </h1>
          <p className="text-gray-600 mt-2">Manage your public listing, fee structure, and professional verification status.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Verification Status */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-600" />
              Verification Status
            </h2>
            <p className="text-4xl font-bold text-purple-600 mt-2">VERIFIED</p>
            <p className="text-sm text-gray-500 mt-1">Your profile is approved and live in search results.</p>
            <Link to="/attorney/verification" className="text-sm font-medium text-purple-500 hover:text-purple-700 mt-3 inline-block">
                View Verification Center
            </Link>
          </div>

          {/* Card 2: Update Profile */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Edit className="w-5 h-5 text-blue-600" />
              Edit Public Details
            </h2>
            <p className="text-sm text-gray-500 mt-2">Update your bio, specializations, education, and firm details.</p>
            <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                Go to Profile Editor
            </button>
          </div>
          
          {/* Card 3: Fee Management (Placeholder) */}
           <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 col-span-1 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Upload className="w-5 h-5 text-orange-600" />
              Documents & Credentials
            </h2>
            <p className="text-sm text-gray-500 mt-2">Manage your professional license, certifications, and other credentials.</p>
            <button className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700">
                Manage Documents
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-8">Current Path: /profile/settings</p>
      </div>
    </Layout>
  );
}