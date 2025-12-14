// src/pages/attorney/AttorneyVerificationFormPage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'; // FIX 1: Import useFieldArray
import { toast } from 'react-hot-toast'; 
import { Loader2, CheckCircle, Upload, Plus, Trash2 } from 'lucide-react'; // FIX 2: Added Plus and Trash2

import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import { useProfile } from '@/hooks/auth/use-auth';
// Removed unused 'useUploadDocument' export
import { useSubmitVerification, useVerificationStatus } from '@/hooks/attorney/use-verification'; 

// --- UPDATED INTERFACE ---
// FIX 3: Updated input type to include array fields
interface VerificationFormInput {
    hourlyRate: number;
    consultationFee: number;
    minConsultationDuration: number;
    specializations: string; 
    bio: string;
    
    education: {
        institution: string;
        degree: string;
        year: number;
    }[];
    
    certifications: {
        name: string;
        issuer: string;
        year: number;
    }[];
    // NOTE: MaxDuration field is not needed here as it's static in onSubmit
}

const AttorneyVerificationFormPage: React.FC = () => {
    const navigate = useNavigate();
    const { data: profileData } = useProfile();
    const { data: statusData } = useVerificationStatus();
    
    const { mutate: submitVerification, isPending: isSubmitting } = useSubmitVerification(); 

    const attorneyProfile = profileData?.attorney;

    const { 
        register, 
        handleSubmit, 
        control, // FIX 4: Get control object for useFieldArray
        formState: { errors } 
    } = useForm<VerificationFormInput>({
        defaultValues: {
            hourlyRate: attorneyProfile?.hourlyRate || 0,
            bio: attorneyProfile?.bio || '',
            specializations: attorneyProfile?.specializations?.join(', ') || '',
            consultationFee: 2000, 
            minConsultationDuration: 30,
            // Initialize arrays if profile data exists, otherwise start with one empty item
            education: attorneyProfile?.education || [{ institution: '', degree: '', year: new Date().getFullYear() }],
            certifications: attorneyProfile?.certifications || [{ name: '', issuer: '', year: new Date().getFullYear() }],
        },
    });
    
    // FIX 5: Dynamic arrays for Education
    const { 
        fields: educationFields, 
        append: appendEducation, 
        remove: removeEducation 
    } = useFieldArray({
        control,
        name: "education",
    });

    // FIX 6: Dynamic arrays for Certifications
    const { 
        fields: certificationFields, 
        append: appendCertification, 
        remove: removeCertification 
    } = useFieldArray({
        control,
        name: "certifications",
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
            maxConsultationDuration: 120, // Static for now
            // Ensure array fields are included
            education: data.education,
            certifications: data.certifications,
        };

        submitVerification(payload, {
            onSuccess: () => {
                navigate('/attorney/verification-status');
            },
        });
    };

    // Placeholder for document upload form logic
    const handleDocumentUpload = () => {
        toast('Document upload feature needs implementation.', { icon: 'ℹ️' }); 
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
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            
                            {/* --- General Professional Details --- */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold border-b pb-2">Professional Details</h2>
                                
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
                            </div>

                            {/* --- Education Section --- */}
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <h2 className="text-xl font-semibold">Educational Background</h2>
                                {educationFields.map((field, index) => (
                                    <div key={field.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
                                        <div className="flex justify-end">
                                            {educationFields.length > 1 && (
                                                <Button 
                                                    type="button" 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => removeEducation(index)}
                                                    className="text-red-500 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" /> Remove Entry
                                                </Button>
                                            )}
                                        </div>
                                        <Input
                                            label="Institution"
                                            {...register(`education.${index}.institution` as const, { required: 'Institution name is required.' })}
                                            error={errors.education?.[index]?.institution?.message}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label="Degree/Qualification"
                                                {...register(`education.${index}.degree` as const, { required: 'Degree is required.' })}
                                                error={errors.education?.[index]?.degree?.message}
                                            />
                                            <Input
                                                label="Graduation Year"
                                                type="number"
                                                {...register(`education.${index}.year` as const, { required: true, valueAsNumber: true })}
                                                error={errors.education?.[index]?.year?.message}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => appendEducation({ institution: '', degree: '', year: new Date().getFullYear() })}
                                    className="w-full mt-2 border-dashed"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Add Education
                                </Button>
                            </div>

                            {/* --- Certifications Section --- */}
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <h2 className="text-xl font-semibold">Certifications & Licenses</h2>
                                {certificationFields.map((field, index) => (
                                    <div key={field.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
                                        <div className="flex justify-end">
                                            {certificationFields.length > 1 && (
                                                <Button 
                                                    type="button" 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => removeCertification(index)}
                                                    className="text-red-500 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" /> Remove Entry
                                                </Button>
                                            )}
                                        </div>
                                        <Input
                                            label="Certification Name"
                                            {...register(`certifications.${index}.name` as const, { required: 'Certification name is required.' })}
                                            error={errors.certifications?.[index]?.name?.message}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label="Issuing Body"
                                                {...register(`certifications.${index}.issuer` as const, { required: 'Issuer is required.' })}
                                                error={errors.certifications?.[index]?.issuer?.message}
                                            />
                                            <Input
                                                label="Year Acquired"
                                                type="number"
                                                {...register(`certifications.${index}.year` as const, { required: true, valueAsNumber: true })}
                                                error={errors.certifications?.[index]?.year?.message}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => appendCertification({ name: '', issuer: '', year: new Date().getFullYear() })}
                                    className="w-full mt-2 border-dashed"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Add Certification
                                </Button>
                            </div>


                            {/* --- Rate & Consultation Section --- */}
                            <div className="space-y-6 pt-4 border-t border-gray-100">
                                <h2 className="text-xl font-semibold mb-4">Rate & Consultation</h2>
                                
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

                    {/* Document Upload Section (Remains the same) */}
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