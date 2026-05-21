// src/components/admin/AdminAttorneyReviewPage.tsx

import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Clock, CheckCircle, XCircle, FileText, Briefcase, DollarSign, Loader2, ArrowLeft, MapPin } from 'lucide-react';

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
    const location = useLocation();

    // ✅ Try to get attorney data from navigation state first (passed from list page)
    const stateAttorney = location.state?.attorney;

    // ✅ Only fetch from API if we don't have state data
    const { data: fetchedAttorney, isLoading, isError } = useAdminAttorneyDetails(
        attorneyId || '', 
        { enabled: !stateAttorney }
    );

    const { mutate: reviewVerification, isPending: isReviewing } = useReviewVerification();

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

    // Loading state (only when fetching, not when using state data)
    if (!stateAttorney && (!attorneyId || isLoading)) {
        return (
            <Layout>
                <div className="text-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto" />
                    <p className="text-gray-500 mt-4">Loading attorney details...</p>
                </div>
            </Layout>
        );
    }

    // Error state
    if (!stateAttorney && (isError || !fetchedAttorney)) {
        return (
            <Layout>
                <div className="text-center py-20">
                    <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <p className="text-red-600 text-lg font-medium">Error loading attorney details.</p>
                    <p className="text-gray-500 mt-2">The attorney may not exist or the endpoint is unavailable.</p>
                    <Button onClick={() => navigate('/admin/attorneys/verification')} variant="outline" className="mt-6">
                        Back to Queue
                    </Button>
                </div>
            </Layout>
        );
    }

    // ✅ Resolve data from either source
    // State data (from list page): has flat structure { fullName, email, firmName, ... }
    // Fetched data (from API): has nested structure { user: { fullName, email }, firmName, ... }
    const attorney = stateAttorney || fetchedAttorney;

    // Extract user info (handles both flat and nested structures)
    const userName = attorney?.fullName || attorney?.user?.fullName || 'Unknown Attorney';
    const userEmail = attorney?.email || attorney?.user?.email || '';
    const userPhone = attorney?.phoneNumber || attorney?.user?.phoneNumber || '';
    const userAvatar = attorney?.avatarUrl || attorney?.user?.avatarUrl || null;

    // Extract profile info (handles both structures)
    // If data came from list: profile fields are directly on attorney or nested in attorneyProfile
    // If data came from fetch: profile fields are directly on attorney object
    const profile = attorney?.attorneyProfile || attorney;
    
    const firmName = profile?.firmName || 'N/A';
    const yearsOfExperience = profile?.yearsOfExperience || 0;
    const hourlyRate = profile?.hourlyRate || 0;
    const bio = profile?.bio || 'No detailed bio provided.';
    const specializations = profile?.specializations || [];
    const locationText = profile?.location || profile?.state || profile?.availability?.timezone || 'N/A';
    const verificationStatus = profile?.verificationStatus || 'pending';
    const submittedAt = profile?.submittedForVerificationAt || profile?.submittedAt;
    const professionalDocuments = profile?.professionalDocuments || [];
    const consultationFee = profile?.consultationFee;
    const minDuration = profile?.minConsultationDuration;
    const maxDuration = profile?.maxConsultationDuration;

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
    
    const handleDocumentVerify = (_docId: string, _currentStatus: boolean) => {
        toast('Document verification feature coming soon.', { icon: 'ℹ️' });
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
                <header className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Review attorney submission</h1>
                    <Button onClick={() => navigate('/admin/attorneys/verification')} variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to queue
                    </Button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Column 1-2: Attorney Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Profile Card */}
                        <Card className="p-8">
                            <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100">
                                <div className="flex items-center gap-4">
                                    <Avatar src={userAvatar || undefined} name={userName} size="xl" /> 
                                    <div>
                                        <h2 className="text-2xl font-semibold text-gray-900">{userName}</h2>
                                        <p className="text-sm text-gray-500">{firmName}</p>
                                        <p className="text-sm text-primary-600">{userEmail}</p>
                                        {userPhone && <p className="text-sm text-gray-500">{userPhone}</p>}
                                    </div>
                                </div>
                                <div className="text-right">
                                    {getStatusChip(verificationStatus)}
                                    {submittedAt && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            Submitted: {format(new Date(submittedAt), 'PP')}
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-semibold mb-4">Professional overview</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-gray-500" /> 
                                    Years of experience: <span className="font-medium">{yearsOfExperience}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-gray-500" /> 
                                    Hourly rate: <span className="font-medium">{formatCurrency(hourlyRate)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-500" /> 
                                    Location: <span className="font-medium">{locationText}</span>
                                </div>
                                {consultationFee !== undefined && (
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-gray-500" /> 
                                        Consultation fee: <span className="font-medium">{formatCurrency(consultationFee)}</span>
                                    </div>
                                )}
                                {minDuration && maxDuration && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-500" /> 
                                        Duration: <span className="font-medium">{minDuration}–{maxDuration} mins</span>
                                    </div>
                                )}
                            </div>

                            <h3 className="text-xl font-semibold mb-4 border-t pt-6">Bio and specializations</h3>
                            <p className="text-gray-700 mb-6 italic">{bio}</p>
                            
                            {specializations.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {specializations.map((spec: string, index: number) => (
                                        <span key={index} className="px-3 py-1 bg-primary-50 text-xs text-primary-700 font-medium rounded-full">
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </Card>

                        {/* Documents Card */}
                        <Card className="p-8">
                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <FileText className="w-5 h-5" /> Verification documents
                            </h3>
                            
                            <div className="space-y-4">
                                {professionalDocuments.length > 0 ? (
                                    professionalDocuments.map((doc: any, index: number) => (
                                        <div key={index} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                                            <div className="text-sm">
                                                <p className="font-medium capitalize">
                                                    {(doc.documentType || 'document').replace(/_/g, ' ')}
                                                </p>
                                                {doc.uploadedAt && (
                                                    <p className="text-xs text-gray-500">
                                                        Uploaded: {format(new Date(doc.uploadedAt), 'PP')}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <a 
                                                    href={doc.documentUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="text-primary-600 hover:underline text-sm"
                                                >
                                                    View document
                                                </a>
                                                <Button 
                                                    onClick={() => handleDocumentVerify(doc.documentUrl, doc.verified)}
                                                    variant={doc.verified ? "success" : "secondary"}
                                                    size="sm"
                                                >
                                                    {doc.verified ? 'Verified' : 'Mark verified'}
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-6">
                                        No professional documents uploaded yet.
                                    </p>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Column 3: Review Form */}
                    <Card className="lg:col-span-1 p-6 sticky top-4 self-start">
                        <h2 className="text-2xl font-bold mb-6">Review action</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            
                            {/* Status Toggle */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Set verification status</label>
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
                                        {...register('rejectionReason', { 
                                            required: watchStatus === 'rejected' ? 'Rejection reason is mandatory.' : false 
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="">-- Select rejection reason --</option>
                                        <option value="incomplete_documents">Incomplete documents</option>
                                        <option value="license_invalid">License expired/invalid</option>
                                        <option value="inaccurate_info">Inaccurate profile information</option>
                                        <option value="other">Other reason</option>
                                    </select>
                                    {errors.rejectionReason && (
                                        <p className="text-xs text-red-500">{errors.rejectionReason.message}</p>
                                    )}

                                    <Textarea
                                        id="rejectionDetails"
                                        label="Rejection details"
                                        {...register('rejectionDetails')}
                                        placeholder="Provide specific details about why the profile was rejected."
                                    />
                                </div>
                            )}

                            {/* Admin Notes */}
                            <Textarea
                                id="adminNotes"
                                label="Internal admin notes (optional)"
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
                                {isReviewing ? (
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                ) : (
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                )}
                                {watchStatus === 'approved' ? 'Finalize approval' : 'Finalize rejection'}
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default AdminAttorneyReviewPage;