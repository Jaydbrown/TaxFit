// src/pages/attorney/AttorneyClientPortalPage.tsx

import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal'; 
import { Users, FolderOpen, MessageSquare, Search, FileText, Loader2, Upload, Settings, Filter, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Assuming these hooks are correctly implemented
import { 
    useAttorneyDashboardStats, 
    useUploadDocument 
} from '@/hooks/attorney/use-attorney-management';

// --- Helper Modals (No functional changes) ---

const ClientSearchModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [search, setSearch] = useState('');
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Search Clients">
            <div className="space-y-4">
                <Input
                    label="Client Name or Case ID"
                    placeholder="e.g., John Doe or CASE-001"
                    leftIcon={<Search className="w-4 h-4" />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button className="w-full" disabled={!search}>
                    Search Database
                </Button>
                <p className="text-sm text-gray-500 mt-4 text-center">
                    (Search results table would appear here dynamically.)
                </p>
            </div>
        </Modal>
    );
};

const DocumentUploadModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [documentType, setDocumentType] = useState('');
    
    const { mutate: uploadDocument, isPending } = useUploadDocument();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        } else {
            setFile(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select a document to upload.");
            return;
        }

        const formData = new FormData();
        formData.append('document', file);
        formData.append('documentType', documentType || 'general');
        
        uploadDocument(formData, {
            onSuccess: () => {
                onClose();
                setFile(null);
            },
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Upload Case Document">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Document Tag/Type (e.g., Affidavit, License)"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    placeholder="e.g., Client ID Verification"
                />
                
                <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,image/*"
                    />
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                        {file ? `File Selected: ${file.name}` : 'Click to select a file (PDF, DOCX, Image)'}
                    </p>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                    <Button variant="outline" onClick={onClose} type="button">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={!file || isPending}>
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Upload Document'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};


// --- Main Page Component ---

export default function AttorneyClientPortalPage() {
    
  // NOTE: Corrected the closing tag for the main container
  
  const { data: stats, isLoading, isError } = useAttorneyDashboardStats();
  
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const activeCases = stats?.activeCases ?? 0;
  const unreadMessages = stats?.unreadMessages ?? 0;
  
  // Custom display component for consistent styling and loading state in stat cards
  const StatDisplay: React.FC<{ value: number, color: string, label: string }> = ({ value, color, label }) => {
    return (
        <Card className="shadow-xl border-l-4" style={{ borderColor: color }}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wider">{label}</p>
                    {isLoading ? (
                        <Loader2 className={`w-6 h-6 ${color} animate-spin mt-2`} style={{ color: color }} />
                    ) : isError ? (
                        <p className="text-3xl font-extrabold text-red-500">N/A</p>
                    ) : (
                        <p className="text-4xl font-extrabold" style={{ color: color }}>{value}</p>
                    )}
                </div>
                {label === 'ACTIVE CASES' ? (
                    <FolderOpen className="w-8 h-8 text-gray-300" />
                ) : (
                    <MessageSquare className="w-8 h-8 text-gray-300" />
                )}
            </div>
            <p className="text-xs text-gray-500 mt-3 border-t pt-2">
                {label === 'ACTIVE CASES' ? 'Cases currently being handled.' : 'Pending client communication.'}
            </p>
        </Card>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-10 min-h-screen bg-gray-50">
        <header className="mb-10 border-b border-gray-200 pb-5 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-primary-600" />
              Attorney Client Portal
            </h1>
            <p className="text-lg text-gray-600 mt-2">Manage client interactions, case files, and firm efficiency.</p>
          </div>
          {/* Main Action Button for New Client */}
          <Button variant="primary" className='shadow-lg hover:shadow-xl' leftIcon={<Plus className="w-4 h-4" />}>
            Add New Client
          </Button>
        </header>

        {/* Client Stats & Actions Grid (Enhanced Aesthetics) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Stat Card 1: Active Cases */}
          <StatDisplay 
            value={activeCases} 
            color="#00C891" // Secondary color shade
            label="ACTIVE CASES"
          />

          {/* Stat Card 2: Unread Messages */}
          <StatDisplay 
            value={unreadMessages} 
            color="#10B981" // Green shade (Success)
            label="UNREAD MESSAGES"
          />
          
          {/* Action Card 1: Client Search (Elevated Button Style) */}
          <Button 
            variant="outline" 
            className="h-full flex flex-col justify-center items-center p-6 border-2 border-dashed border-primary-300 hover:border-primary-500 bg-primary-50 hover:bg-primary-100 transition-colors shadow-md"
            onClick={() => setShowSearchModal(true)}
          >
            <Search className="w-8 h-8 text-primary-600 mb-2" />
            <h2 className="text-xl font-bold text-primary-700">Client Search</h2>
            <p className="text-sm text-gray-600 mt-1">Find clients & review history.</p>
          </Button>

          {/* Action Card 2: Document Upload (Elevated Button Style) */}
          <Button 
            variant="outline" 
            className="h-full flex flex-col justify-center items-center p-6 border-2 border-dashed border-red-300 hover:border-red-500 bg-red-50 hover:bg-red-100 transition-colors shadow-md"
            onClick={() => setShowUploadModal(true)}
          >
            <FileText className="w-8 h-8 text-red-600 mb-2" />
            <h2 className="text-xl font-bold text-red-700">Case Document Upload</h2>
            <p className="text-sm text-gray-600 mt-1">Submit files directly to a case file.</p>
          </Button>
        </div>

        {/* Main Content Area: Client/Case List */}
        <div className="mt-10">
            <Card className="p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Current Client & Case List</h3>
                
                {/* Search and Filter Bar (Refined Styling) */}
                <div className="mb-6 p-4 border border-gray-200 rounded-xl bg-white flex flex-col md:flex-row gap-4 items-center justify-between shadow-inner">
                    <Input 
                        type="text" 
                        placeholder="Search by client name or case ID..." 
                        className="w-full md:w-1/3 p-3"
                        leftIcon={<Search className='w-4 h-4 text-gray-400' />}
                    />
                    <select className="p-3 border border-gray-300 rounded-lg w-full md:w-auto text-gray-700 focus:ring-primary-500 focus:border-primary-500">
                        <option value="">Filter by Status: All</option>
                        <option>Status: Active</option>
                        <option>Status: Pending Review</option>
                        <option>Status: Closed</option>
                    </select>
                    <Button variant='outline' className='w-full md:w-auto' leftIcon={<Filter className='w-4 h-4' />}>
                        Apply Filter
                    </Button>
                </div>

                {/* Data Table Placeholder */}
                {isLoading ? (
                    <div className="text-sm text-gray-500 py-12 text-center border border-dashed rounded-xl flex items-center justify-center bg-gray-50">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading Client List Data...
                    </div>
                ) : (
                    <div className="py-12 text-center bg-gray-50 border rounded-xl border-gray-200">
                        <p className="text-lg font-medium text-gray-800 mb-2">Detailed Case Management Table</p>
                        <p className="text-sm text-gray-500">
                            (Dynamic client list and status management UI will be rendered here upon API integration)
                        </p>
                    </div>
                )}
            </Card>
        </div>
      </div>
      {/* Modals: Rendered at the root level of the component's return */}
      <ClientSearchModal 
        isOpen={showSearchModal} 
        onClose={() => setShowSearchModal(false)} 
      />
      <DocumentUploadModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
      />
    </Layout>
  );
}