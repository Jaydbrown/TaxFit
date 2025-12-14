// src/pages/admin/AdminAttorneyReviewPage.tsx

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Clock, CheckCircle, XCircle, FileText, Briefcase, DollarSign, Loader2, ArrowRight, MapPin } from 'lucide-react';

import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Textarea from '@/components/common/Textarea';
import Avatar from '@/components/common/Avatar';
import { useAdminAttorneyDetails, useReviewVerification } from '@/hooks/attorney/use-verification';
import { format } from 'date-fns';
import { formatCurrency } from '@/utils/helpers';


interface ReviewFormInput {
    status: 'approved' | 'rejected';
    adminNotes: string;
    rejectionReason: 'incomplete_documents' | 'license_invalid' | 'inaccurate_info' | 'other' | '';
    rejectionDetails: string;
}

const AdminAttorneyReviewPage: React.FC = () => {
    const { attorneyId } = useParams<{ attorneyId: string }>();
    const navigate = useNavigate();

    const { data: attorney, isLoading, isError } = useAdminAttorneyDetails(attorneyId || '');
    const { mutate: reviewVerification, isPending: isReviewing } = useReviewVerification(); // FIX: isPending

    const { register, handleSubmit, watch, formState: { errors } } = useForm<ReviewFormInput>({
        defaultValues: {
            status: 'approved',
            adminNotes: '',
            rejectionReason: '',
            rejectionDetails: '',
        }
    });

    const watchStatus = watch('status');
    const watchRejectionReason = watch('rejectionReason');

    if (!attorneyId || isLoading) {
        return (
            <Layout>
                <div className="text-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto" /></div>
            </Layout>
        );
    }

    if (isError || !attorney) {
        return (
            <Layout>
                <div className="text-center py-20 text-red-600">Error loading attorney details.</div>
            </Layout>
        );
    }
    
    const user = attorney;
    const profile = attorney.attorneyProfile;
    const currentStatus = profile.verificationStatus || 'draft';

    const onSubmit: SubmitHandler<ReviewFormInput> = (formData) => {
        if (formData.status === 'rejected' && !formData.rejectionReason) {
            toast.error("Please select a rejection reason.");
            return;
        }

        const payload = {
            status: formData.status,
            adminNotes: formData.adminNotes,
            rejectionReason: formData.status === 'rejected' ? formData.rejectionReason : undefined,
            rejectionDetails: formData.status === 'rejected' ? formData.rejectionDetails : undefined,
        };

        reviewVerification({ attorneyId: attorneyId!, data: payload }, {
            onSuccess: () => {
                navigate('/admin/attorneys/verification');
            }
        });
    };

    const getStatusChip = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="inline-flex items-center gap-2 px-4 py-1 text-sm font-medium rounded-full bg-green-100 text-green-700"><CheckCircle className="w-4 h-4" /> Approved</span>;
            case 'rejected':
                return <span className="inline-flex items-center gap-2 px-4 py-1 text-sm font-medium rounded-full bg-red-100 text-red-700"><XCircle className="w-4 h-4" /> Rejected</span>;
            default:
                return <span className="inline-flex items-center gap-2 px-4 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-700"><Clock className="w-4 h-4" /> Pending</span>;
        }
    };
    
    // Placeholder for document verification
    const handleDocumentVerify = (docId: string, currentStatus: boolean) => {
        toast('Document upload feature needs implementation.', { icon: 'ℹ️' });
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
                <header className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Review Attorney Submission</h1>
                    <Button onClick={() => navigate('/admin/attorneys/verification')} variant="outline">
                        <ArrowRight className="w-4 h-4 rotate-180 mr-2" /> Back to Queue
                    </Button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="p-8">
                            <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100">
                                <div className="flex items-center gap-4">
                                    {/* FIX: Coerce null to undefined */}
                                    <Avatar src={user.avatarUrl || undefined} name={user.fullName} size="xl" /> 
                                    <div>
                                        <h2 className="text-2xl font-semibold text-gray-900">{user.fullName}</h2>
                                        <p className="text-sm text-gray-500">{profile.firmName}</p>
                                        <p className="text-sm text-primary-600">{user.email}</p>
                                    </div>
                                </div>
                                <div>
                                    {getStatusChip(currentStatus)}
                                    {profile.submittedForVerificationAt && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            Submitted: {format(new Date(profile.submittedForVerificationAt), 'PP')}
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-semibold mb-4">Professional Overview</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                                <div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-gray-500" /> Years of Experience: <span className="font-medium">{profile.yearsOfExperience}</span></div>
                                <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-gray-500" /> Hourly Rate: <span className="font-medium">{formatCurrency(profile.hourlyRate)}</span></div>
                                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-500" /> Location: <span className="font-medium">{profile.location || profile.state || 'N/A'}</span></div>
                            </div>

                            <h3 className="text-xl font-semibold mb-4 border-t pt-6">Bio and Specializations</h3>
                            <p className="text-gray-700 mb-6 italic">{profile.bio || "No detailed bio provided."}</p>
                            
                            <div className="flex flex-wrap gap-2">
                                {profile.specializations?.map((spec, index) => (
                                    <span key={index} className="px-3 py-1 bg-primary-50 text-xs text-primary-700 font-medium rounded-full">{spec}</span>
                                ))}
                            </div>
                        </Card>

                        {/* Verification Documents Section */}
                        <Card className="p-8">
                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2"><FileText className="w-5 h-5" /> Verification Documents</h3>
                            
                            <div className="space-y-4">
                                {profile.professionalDocuments && profile.professionalDocuments.length > 0 ? (
                                    profile.professionalDocuments.map((doc: any, index: number) => (
                                        <div key={index} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                                            <div className="text-sm">
                                                <p className="font-medium capitalize">{doc.documentType.replace('_', ' ')}</p>
                                                <p className="text-xs text-gray-500">Uploaded: {format(new Date(doc.uploadedAt), 'PP')}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline text-sm">View Document</a>
                                                <Button 
                                                    onClick={() => handleDocumentVerify(doc.documentUrl, doc.verified)}
                                                    variant={doc.verified ? "success" : "secondary"}
                                                    size="sm"
                                                >
                                                    {doc.verified ? 'Verified' : 'Mark Verified'}
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-6">No professional documents uploaded yet.</p>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Column 3: Admin Review Form */}
                    <Card className="lg:col-span-1 p-6 sticky top-4 self-start">
                        <h2 className="text-2xl font-bold mb-6">Review Action</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            
                            {/* Status Toggle */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Set Verification Status</label>
                                <div className="flex gap-4">
                                    <label className={`flex items-center gap-2 border p-3 rounded-lg flex-1 cursor-pointer transition-colors ${watchStatus === 'approved' ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                                        <input 
                                            type="radio" 
                                            value="approved" 
                                            {...register('status')} 
                                            className="form-radio text-green-600 focus:ring-green-500"
                                        />
                                        <span className="text-sm font-medium text-green-700">Approve</span>
                                    </label>
                                    <label className={`flex items-center gap-2 border p-3 rounded-lg flex-1 cursor-pointer transition-colors ${watchStatus === 'rejected' ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                                        <input 
                                            type="radio" 
                                            value="rejected" 
                                            {...register('status')} 
                                            className="form-radio text-red-600 focus:ring-red-500"
                                        />
                                        <span className="text-sm font-medium text-red-700">Reject</span>
                                    </label>
                                </div>
                            </div>

                            {/* Rejection Details (Conditional) */}
                            {watchStatus === 'rejected' && (
                                <div className="space-y-4 pt-2 pb-4 border-t border-red-100">
                                    <select 
                                        {...register('rejectionReason', { required: watchStatus === 'rejected' ? 'Rejection reason is mandatory.' : false })}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="">-- Select Rejection Reason --</option>
                                        <option value="incomplete_documents">Incomplete Documents</option>
                                        <option value="license_invalid">License Expired/Invalid</option>
                                        <option value="inaccurate_info">Inaccurate Profile Information</option>
                                        <option value="other">Other Reason</option>
                                    </select>
                                    {errors.rejectionReason && <p className="text-xs text-red-500">{errors.rejectionReason.message}</p>}

                                    <Textarea
                                        id="rejectionDetails"
                                        label="Rejection Details (Internal/User Note)"
                                        {...register('rejectionDetails')}
                                        placeholder="Provide specific details about why the profile was rejected."
                                    />
                                </div>
                            )}

                            {/* Admin Notes */}
                            <Textarea
                                id="adminNotes"
                                label="Internal Admin Notes (Optional)"
                                {...register('adminNotes')}
                                placeholder="Notes are not visible to the attorney."
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isReviewing || (watchStatus === 'rejected' && !watchRejectionReason)}
                                className={`w-full ${watchStatus === 'rejected' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                                size="lg"
                            >
                                {isReviewing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                                {watchStatus === 'approved' ? 'Finalize Approval' : 'Finalize Rejection'}
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default AdminAttorneyReviewPage;