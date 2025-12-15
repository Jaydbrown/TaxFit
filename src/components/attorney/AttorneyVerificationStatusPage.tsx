import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useVerificationStatus } from '@/hooks/attorney/use-verification';
import { Loader2, Clock, CheckCircle, XCircle, FileText, ArrowRight } from 'lucide-react';

import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { format } from 'date-fns';

const AttorneyVerificationStatusPage: React.FC = () => {
    const navigate = useNavigate();
    const { data: status, isLoading, isError } = useVerificationStatus();

    if (isLoading) {
        return (
            <Layout>
                <div className="text-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">Checking verification status...</p>
                </div>
            </Layout>
        );
    }
    
    if (isError || !status) {
        return (
            <Layout>
                <div className="text-center py-20 text-red-600">
                    <XCircle className="w-10 h-10 mx-auto mb-4" />
                    <p className="text-xl">Could not retrieve verification status.</p>
                </div>
            </Layout>
        );
    }

    const verificationStatus = status.verificationStatus;

    let icon, title, description, actionButton;

    switch (verificationStatus) {
        case 'pending':
            icon = <Clock className="w-16 h-16 text-yellow-600 mb-6" />;
            title = "Verification Pending";
            description = "Your profile and documents have been submitted and are currently under review by our administration team. This typically takes 1-3 business days.";
            actionButton = (
                <Button variant="outline" onClick={() => navigate('/attorney/upload-document')}>
                    <FileText className="w-4 h-4 mr-2" /> Review Documents
                </Button>
            );
            break;
            
        case 'approved':
            icon = <CheckCircle className="w-16 h-16 text-green-600 mb-6" />;
            title = "Profile Verified!";
            description = "Congratulations! Your profile is now live and visible to potential clients. You are now eligible to receive consultation requests.";
            actionButton = (
                <Button onClick={() => navigate('/attorney/dashboard')}>
                    <ArrowRight className="w-4 h-4 mr-2" /> Go to Dashboard
                </Button>
            );
            break;
            
        case 'rejected':
            icon = <XCircle className="w-16 h-16 text-red-600 mb-6" />;
            title = "Verification Rejected";
            description = `Your submission was rejected. Reason: ${status.rejectionReason || 'See details below.'}`;
            actionButton = (
                <Button onClick={() => navigate('/attorney/submit-verification')} variant="danger">
                    Resubmit Profile
                </Button>
            );
            break;

        case 'draft':
        default:
            icon = <FileText className="w-16 h-16 text-gray-600 mb-6" />;
            title = "Profile Incomplete";
            description = "Please complete your professional profile and submit all required documents to begin the verification process.";
            actionButton = (
                <Button onClick={() => navigate('/attorney/submit-verification')}>
                    Complete Submission
                </Button>
            );
            break;
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen">
                <Card className="max-w-3xl mx-auto p-10 text-center shadow-2xl">
                    {icon}
                    <h1 className="text-3xl font-bold mb-4 text-gray-900">{title}</h1>
                    <p className="text-lg text-gray-600 mb-8">{description}</p>
                    
                    {verificationStatus === 'pending' && status.submittedForVerificationAt && (
                        <p className="text-sm text-gray-500 mb-4">
                            Submitted on: {format(new Date(status.submittedForVerificationAt), 'PPp')}
                        </p>
                    )}

                    {verificationStatus === 'rejected' && (
                        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                            <h3 className="font-semibold text-red-700 mb-2">Rejection Details:</h3>
                            <p className="text-sm text-red-600">{status.rejectionDetails || "No specific details provided."}</p>
                            <p className="text-xs text-red-500 mt-2">
                                Please update your profile and resubmit.
                            </p>
                        </div>
                    )}

                    <div className="mt-8">{actionButton}</div>
                    
                    {/* Missing Requirements List */}
                    {status.missingRequirements && status.missingRequirements.length > 0 && (
                        <div className="mt-10 pt-6 border-t border-gray-100">
                            <h3 className="font-semibold text-gray-700 mb-3">Missing Requirements</h3>
                            <ul className="list-disc list-inside text-sm text-red-500 max-w-sm mx-auto">
                                {status.missingRequirements.map((req, index) => (
                                    <li key={index} className="text-left">{req}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Card>
            </div>
        </Layout>
    );
};

export default AttorneyVerificationStatusPage;