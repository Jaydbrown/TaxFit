import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 🎯 Import Link and useNavigate
import Layout from '@/components/layout/Layout';
import { BookOpen, FileText, Globe, Search, Bell, Loader2, XCircle, ArrowRight } from 'lucide-react'; // Added ArrowRight for the 'View All' button
import Card from '@/components/common/Card';
import { formatDate } from '@/utils/helpers';
import Button from '@/components/common/Button'; // Assuming Button component is available

// 🎯 NEW: Import the dynamic hook
import { useFirsRegulatoryUpdates, getUpdateColor, FirsUpdate } from '@/hooks/attorney/use-firs-resources'; // Corrected import path

// --- Helper Component for Rendering Individual Update (Remains the same) ---
const UpdateItem: React.FC<{ update: FirsUpdate }> = ({ update }) => {
    const { border, bg } = getUpdateColor(update.source);
    
    return (
        <li className={`p-3 border-l-4 ${border} ${bg} rounded-r hover:shadow-sm transition-shadow`}>
            <a href={update.url} target="_blank" rel="noopener noreferrer">
                <p className="font-medium text-sm text-gray-800 flex justify-between items-center">
                    <span>{update.title}</span>
                    {update.isNew && (
                        <span className="text-xs font-bold text-red-700 bg-red-200 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">NEW</span>
                    )}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    Source: {update.source} | Published: {formatDate(update.date)}
                </p>
            </a>
        </li>
    );
};

// --- Main Page Component ---

export default function AttorneyTaxResourcesPage() {
    
    const navigate = useNavigate(); // 🎯 Initialize useNavigate

    // 🎯 Use the hook to fetch updates
    const { 
        data: updates, 
        isLoading, 
        isError,
        refetch
    } = useFirsRegulatoryUpdates();

    // --- Dynamic Update Content ---
    let updateContent;

    if (isLoading) {
        updateContent = (
            <div className="flex flex-col items-center justify-center p-8 text-gray-600">
                <Loader2 className="w-6 h-6 animate-spin text-green-600 mb-3" />
                <p>Fetching latest FIRS updates...</p>
            </div>
        );
    } else if (isError) {
        updateContent = (
            <div className="flex flex-col items-center justify-center p-8 text-red-600">
                <XCircle className="w-6 h-6 mb-3" />
                <p className='font-medium mb-2'>Failed to Load Updates</p>
                <button onClick={() => refetch()} className='text-sm underline'>Click to Retry</button>
            </div>
        );
    } else if (updates && updates.length > 0) {
        updateContent = (
            <ul className="space-y-3">
                {updates.slice(0, 5).map(update => ( // Show top 5 updates
                    <UpdateItem key={update.id} update={update} />
                ))}
            </ul>
        );
    } else {
        updateContent = (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <p>No recent regulatory updates found.</p>
            </div>
        );
    }

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
          {/* Section 1: Latest Updates (Now Dynamic) */}
          <Card className="shadow-lg border border-gray-100 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center justify-between border-b pb-2">
              <span className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-red-500" />
                Recent Regulatory Updates
              </span>
              {/* 🎯 FIX: Changed anchor tag to Button with useNavigate */}
              <Button 
                variant='link' 
                size='sm' 
                onClick={() => navigate('/firs-news-feed')} // 🎯 Redirect to the new page
                rightIcon={<ArrowRight className='w-4 h-4 ml-1'/>}
                className="text-sm font-medium"
              >
                View All
              </Button>
            </h2>
            
            {updateContent} 

          </Card>

          {/* Section 2: Reference Tools (Remains Static Links for now) */}
          <Card className="shadow-lg border border-gray-100 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
              <Globe className="w-5 h-5 text-blue-500" />
              Reference Tools & Databases
            </h2>
            <div className="space-y-3">
                <a 
                    href="https://www.firs.gov.ng/" // Placeholder link to FIRS
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block px-4 py-3 border border-gray-300 rounded-lg hover:bg-blue-50 transition-colors"
                >
                    <p className="font-medium">Nigerian Tax Code Database</p>
                    <p className="text-sm text-gray-600">Searchable repository of all legislation (via FIRS).</p>
                </a>
                <a href="#" className="block px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <p className="font-medium">Tax Appeals Tribunal Case Law Index</p>
                    <p className="text-sm text-gray-600">Access key judicial decisions.</p>
                </a>
                <a href="#" className="block px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <p className="font-medium">V.A.T. and Income Tax Calculator</p>
                    <p className="text-sm text-gray-600">Quick computation tools.</p>
                </a>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}