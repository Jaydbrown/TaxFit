// src/pages/attorney/AttorneyVerificationFormPage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Loader2, CheckCircle, Upload } from 'lucide-react';

import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import { useProfile } from '@/hooks/auth/use-auth';
import { useSubmitVerification, useUploadDocument, useVerificationStatus } from '@/hooks/attorney/use-verification';

// Extended input type matching the POST /attorney/submit-verification payload
interface VerificationFormInput {
    hourlyRate: number;
    consultationFee: number;
    minConsultationDuration: number;
    specializations: string; // Will be split by comma
    bio: string;
    // ... other fields like education, certifications, etc., would go here
}

const AttorneyVerificationFormPage: React.FC = () => {
    const navigate = useNavigate();
    const { data: profileData } = useProfile();
    const { data: statusData } = useVerificationStatus();
    const { mutate: submitVerification, isLoading: isSubmitting } = useSubmitVerification();

    const attorneyProfile = profileData?.attorney;

    const { register, handleSubmit, formState: { errors }, watch } = useForm<VerificationFormInput>({
        defaultValues: {
            hourlyRate: attorneyProfile?.hourlyRate || 0,
            bio: attorneyProfile?.bio || '',
            // Populate specializations as a comma-separated string for the form
            specializations: attorneyProfile?.specializations?.join(', ') || '',
            // Assuming default values for new fields
            consultationFee: 2000, 
            minConsultationDuration: 30,
        },
    });

    // Determine current verification state
    const verificationStatus = statusData?.verificationStatus;
    const isPending = verificationStatus === 'pending';
    const isApproved = verificationStatus === 'approved';

    React.useEffect(() => {
        if (isApproved) {
            toast.success("Your profile is already verified!");
            navigate('/attorney/dashboard');
        }
        // Redirect to status page if pending (prevent re-submission)
        if (isPending) {
            navigate('/attorney/verification-status');
        }
    }, [isApproved, isPending, navigate]);

    const onSubmit: SubmitHandler<VerificationFormInput> = (data) => {
        const payload = {
            ...data,
            hourlyRate: Number(data.hourlyRate),
            consultationFee: Number(data.consultationFee),
            minConsultationDuration: Number(data.minConsultationDuration),
            specializations: data.specializations.split(',').map(s => s.trim()).filter(s => s.length > 0),
            // Max duration is assumed to be handled on the backend or set to a default
            maxConsultationDuration: 120, 
        };

        submitVerification(payload, {
            onSuccess: () => {
                navigate('/attorney/verification-status');
            },
        });
    };

    // Placeholder for document upload form logic
    const handleDocumentUpload = () => {
        toast.info("Document upload feature needs implementation.");
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Attorney Verification Submission</h1>
                    <p className="text-gray-600">Complete your professional profile and submit for administrative review.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form Section */}
                    <Card className="lg:col-span-2 p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <h2 className="text-xl font-semibold mb-4">Professional Details</h2>

                            {/* Bio */}
                            <Textarea
                                id="bio"
                                label="Professional Bio (Max 500 characters)"
                                {...register('bio', { required: 'A professional bio is required.', maxLength: { value: 500, message: 'Bio cannot exceed 500 characters.' } })}
                                error={errors.bio?.message}
                            />
                            
                            {/* Specializations */}
                            <Input
                                id="specializations"
                                label="Specializations (Comma separated, e.g., Tax Law, Corporate Tax)"
                                {...register('specializations', { required: 'Please list at least one specialization.' })}
                                error={errors.specializations?.message}
                            />

                            <h2 className="text-xl font-semibold mb-4 pt-4 border-t">Rate & Consultation</h2>
                            
                            {/* Hourly Rate */}
                            <Input
                                id="hourlyRate"
                                label="Hourly Rate (₦)"
                                type="number"
                                {...register('hourlyRate', { 
                                    required: 'Hourly rate is required.', 
                                    valueAsNumber: true,
                                    min: { value: 10000, message: 'Rate must be at least ₦10,000' }
                                })}
                                error={errors.hourlyRate?.message}
                            />
                            
                            {/* Consultation Fee and Duration */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    id="consultationFee"
                                    label="Initial Consultation Fee (₦)"
                                    type="number"
                                    {...register('consultationFee', { required: true, valueAsNumber: true })}
                                    error={errors.consultationFee?.message}
                                />
                                <Input
                                    id="minConsultationDuration"
                                    label="Min Duration (Minutes)"
                                    type="number"
                                    {...register('minConsultationDuration', { required: true, valueAsNumber: true })}
                                    error={errors.minConsultationDuration?.message}
                                />
                            </div>
                            
                            {/* Submit Button */}
                            <div className="pt-6">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                                    size="lg"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                                    Submit Profile for Verification
                                </Button>
                            </div>
                        </form>
                    </Card>

                    {/* Document Upload Section */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Verification Documents</h2>
                        <p className="text-sm text-gray-600 mb-6">
                            Upload required documents (Practice License, CAC Certificate, etc.) here.
                        </p>
                        
                        <div className="space-y-4">
                            {/* Document Upload Placeholder */}
                            <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                                <p className="text-sm text-gray-600">Drag & drop files or click to upload</p>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    className="mt-4" 
                                    onClick={handleDocumentUpload}
                                >
                                    Upload Documents
                                </Button>
                            </div>
                            
                            {/* Status List Placeholder */}
                            <div className="text-sm text-gray-700 space-y-2 pt-4 border-t">
                                <p className="flex justify-between items-center">
                                    Practice License 
                                    <span className="text-red-500 font-medium">Missing</span>
                                </p>
                                <p className="flex justify-between items-center">
                                    CAC Certificate 
                                    <span className="text-green-600 font-medium">Uploaded</span>
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default AttorneyVerificationFormPage;