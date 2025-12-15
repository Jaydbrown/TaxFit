import React, { useState, useEffect } from 'react';
import { Camera, Save, Loader2, AlertCircle, Briefcase, DollarSign } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useUpdateProfile, useUploadAvatar } from '@/hooks/auth/use-auth';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Avatar from '@/components/common/Avatar';
import Textarea from '@/components/common/Textarea'; // Assuming you have a Textarea component
import { formatCurrency } from '@/utils/helpers'; // Assuming this is available

// Define the required shape for the update profile payload
interface ProfileFormState {
    fullName: string;
    phoneNumber: string;
    // Attorney-specific fields
    firmName?: string;
    bio?: string;
    hourlyRate?: number;
}

export default function ProfileSettings() {
    const { user } = useAuthStore();
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
    const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar();
    
    // Check if user is an attorney
    const isAttorney = user?.userType === 'attorney';
    const attorneyProfile = user?.attorneyProfile;

    // --- State Initialization ---
    const [formData, setFormData] = useState<ProfileFormState>(() => ({
        // FIX 1: Initialize state robustly using user data
        fullName: user?.fullName || '',
        phoneNumber: user?.phoneNumber || '',
        
        // Initialize attorney fields only if applicable
        ...(isAttorney && {
            firmName: attorneyProfile?.firmName || '',
            bio: attorneyProfile?.bio || '',
            hourlyRate: attorneyProfile?.hourlyRate || undefined,
        }),
    }));

    // Use useEffect to update state if user data loads later (e.g., on first load)
    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                phoneNumber: user.phoneNumber || '',
          
            });
        }
    }, [user, isAttorney, attorneyProfile]);


    const [uploadError, setUploadError] = useState<string | null>(null);
    const [updateError, setUpdateError] = useState<string | null>(null);

    // --- Avatar Upload Logic ---
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation checks... (Your existing logic is fine here)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('Image size must be less than 5MB');
            return;
        }
        if (!file.type.startsWith('image/')) {
            setUploadError('Please upload an image file');
            return;
        }

        setUploadError(null);
        uploadAvatar(file, {
            onSuccess: () => {
                setUploadError(null);
            },
            onError: (error: any) => {
                setUploadError(error.response?.data?.message || 'Failed to upload image. Please try again.');
            },
        });
    };

    // --- Form Submission Logic ---
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setUpdateError(null);

        // Filter out email as it cannot be changed and we only want to send fields that were updated or are editable.
        const payload: Partial<ProfileFormState> = {
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            // Include attorney-specific fields in the payload if they exist
            ...(isAttorney && {
                firmName: formData.firmName,
                bio: formData.bio,
                hourlyRate: formData.hourlyRate,
            })
        };

        updateProfile(payload, {
            onSuccess: () => {
                setUpdateError(null);
            },
            onError: (error: any) => {
                setUpdateError(error.response?.data?.message || 'Failed to update profile. Please try again.');
            },
        });
    };
    
    // Safety check for user data loaded
    if (!user) {
        return <div className="text-center py-10 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin inline-block mr-2" /> Loading user data...
        </div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h2>
                <p className="text-gray-600">Update your personal information and profile picture</p>
            </div>

            {/* Avatar Upload */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
                
                <div className="flex items-center gap-6">
                    <Avatar
                        // FIX 2: Safely pass the src prop
                        src={user.avatarUrl ?? undefined} 
                        name={user.fullName || 'User'}
                        size="xl"
                    />
                    
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="avatar-upload"
                                disabled={isUploading}
                            />
                            <label
                                htmlFor="avatar-upload"
                                className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                                    isUploading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {/* ... (omitted loading text for brevity) ... */}
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Uploading...</span>
                                    </>
                                ) : (
                                    <>
                                        <Camera className="w-4 h-4" />
                                        <span>Change Picture</span>
                                    </>
                                )}
                            </label>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            JPG, PNG or GIF. Max size 5MB.
                        </p>
                        
                        {uploadError && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-800">{uploadError}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                
                {/* General Fields */}
                <Input
                    label="Full Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                />

                <Input
                    label="Email Address"
                    type="email"
                    // Use the email directly from the store as it is disabled
                    value={user.email} 
                    disabled
                    className="bg-gray-50 cursor-not-allowed"
                />

                <Input
                    label="Phone Number"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+234 800 000 0000"
                />

                {/* --- Attorney-Specific Editable Fields --- */}
                {isAttorney && (
                    <>
                        <h3 className="text-lg font-semibold text-gray-900 pt-4 border-t mt-6">Professional Details</h3>
                        
                        <Input
                            label="Firm / Practice Name"
                            value={formData.firmName || ''}
                            onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                            placeholder="Doe & Associates Law Firm"
                            leftIcon={<Briefcase className="w-5 h-5" />}
                        />
                        
                        <Textarea
                            label="Professional Bio"
                            value={formData.bio || ''}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Provide a brief summary of your legal expertise and background."
                            rows={4}
                        />

                        <Input
                            label={`Hourly Rate (NGN) - Currently: ${formData.hourlyRate ? formatCurrency(formData.hourlyRate) : 'N/A'}`}
                            type="number"
                            value={formData.hourlyRate || ''}
                            onChange={(e) => setFormData({ 
                                ...formData, 
                                hourlyRate: e.target.value ? Number(e.target.value) : undefined 
                            })}
                            placeholder="e.g., 50000"
                            leftIcon={<DollarSign className="w-5 h-5" />}
                        />
                    </>
                )}
                
                {/* Update Error */}
                {updateError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{updateError}</p>
                    </div>
                )}

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={isUpdating}
                        leftIcon={isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    >
                        {isUpdating ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}