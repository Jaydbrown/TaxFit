import React, { useState, useEffect } from 'react';
import { Camera, Save, Loader2, AlertCircle, Briefcase, DollarSign } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useUpdateProfile, useUploadAvatar } from '@/hooks/auth/use-auth';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Avatar from '@/components/common/Avatar';
import Textarea from '@/components/common/Textarea'; 
import { formatCurrency } from '@/utils/helpers'; 
import type { User, AttorneyProfile } from '@/types/index'; // Import base User and AttorneyProfile types

// --- LOCAL TYPES ---

// Define a type that represents the full user object expected from the store, 
// including the optional profiles, for type safety assertion.
interface FullUser extends User {
    attorneyProfile?: AttorneyProfile | null;
}

interface ProfileFormState {
    fullName: string;
    phoneNumber: string;
    // Attorney-specific fields
    firmName?: string;
    bio?: string;
    hourlyRate?: number; // Must be number or undefined for submission
}

// --- COMPONENT ---

export default function ProfileSettings() {
    const { user } = useAuthStore();
    
    // FIX 1: Assert the user object type to include the profile data (FullUser)
    // We trust that the auth store gives us the complete structure when available.
    const fullUser = user as FullUser | undefined; 

    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
    const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar();
    
    const isAttorney = fullUser?.userType === 'attorney';
    
    // FIX 2: Access the attorneyProfile via the asserted variable (fullUser)
    const attorneyProfile = fullUser?.attorneyProfile; // This is now type-safe

    // --- State Initialization ---
    const [formData, setFormData] = useState<ProfileFormState>(() => ({
        fullName: fullUser?.fullName || '',
        phoneNumber: fullUser?.phoneNumber || '',
        
        ...(isAttorney && {
            firmName: attorneyProfile?.firmName || '',
            bio: attorneyProfile?.bio || '',
            hourlyRate: attorneyProfile?.hourlyRate ?? undefined, // Use ?? undefined for safety
        }),
    }));

    // --- Side Effect: Initial Hydration & Sync ---
    useEffect(() => {
        if (fullUser) {
            setFormData({
                fullName: fullUser.fullName || '',
                phoneNumber: fullUser.phoneNumber || '',
                // Only set attorney fields if user is an attorney and data exists
                ...(isAttorney && {
                    firmName: attorneyProfile?.firmName || '',
                    bio: attorneyProfile?.bio || '',
                    hourlyRate: attorneyProfile?.hourlyRate ?? undefined,
                })
            });
        }
    }, [fullUser, isAttorney, attorneyProfile]);


    const [uploadError, setUploadError] = useState<string | null>(null);
    const [updateError, setUpdateError] = useState<string | null>(null);

    // --- Avatar Upload Logic ---
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

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

        // Construct the payload, converting empty strings/zeroes to undefined/null for cleaner API interaction
        const payload: ProfileFormState = {
            fullName: formData.fullName || undefined,
            phoneNumber: formData.phoneNumber || undefined,
            
            // Conditionally add attorney fields, ensuring they are not empty strings
            ...(isAttorney && {
                firmName: formData.firmName || undefined,
                bio: formData.bio || undefined,
                // Ensure hourlyRate is a number or undefined, not 0 or empty string
                hourlyRate: formData.hourlyRate && formData.hourlyRate > 0 ? formData.hourlyRate : undefined,
            })
        } as ProfileFormState; // Assert as the payload structure type

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
    if (!fullUser) {
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
                        // FIX 3: Safely pass the src prop by converting null to undefined
                        src={fullUser.avatarUrl ?? undefined} 
                        name={fullUser.fullName || 'User'}
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
                    value={fullUser.email} 
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
                            // If formData.firmName is undefined, use '' for controlled input compatibility
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
                            // If hourlyRate is undefined or 0, use '' for controlled input compatibility
                            value={formData.hourlyRate || ''} 
                            onChange={(e) => setFormData({ 
                                ...formData, 
                                // Store as number if present, otherwise undefined
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