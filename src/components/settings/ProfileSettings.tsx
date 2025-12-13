import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, FileText, Upload, Camera } from 'lucide-react';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useAuthStore } from '@/store/auth-store';
import { useUpdateProfile, useUploadAvatar } from '@/hooks/auth/use-auth';

export default function ProfileSettings() {
  const { user, individualProfile } = useAuthStore();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    address: individualProfile?.address || '',
    dateOfBirth: individualProfile?.dateOfBirth || '',
    taxId: individualProfile?.taxId || '',
  });

  const [profileImage, setProfileImage] = useState<string | null>(user?.avatarUrl || null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadAvatar.mutateAsync(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        fullName: profileData.fullName,
        phoneNumber: profileData.phoneNumber,
        address: profileData.address,
        dateOfBirth: profileData.dateOfBirth,
        taxId: profileData.taxId,
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const initials = profileData.fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card>
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-light text-gray-900 flex items-center gap-2">
          <User className="w-6 h-6 text-primary-600" />
          Personal Information
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Update your personal details and contact information
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Profile Picture
          </label>
          <div className="flex items-center gap-6">
            <div className="relative">
              {profileImage ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-light">
                  {initials}
                </div>
              )}
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-gray-200 cursor-pointer">
                <Camera className="w-4 h-4 text-gray-600" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-3">
                Upload a new profile picture. JPG, PNG or GIF. Max size 5MB.
              </p>
              <div className="flex gap-3">
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Upload className="w-4 h-4" />}
                  disabled={uploadAvatar.isPending}
                  type="button"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                >
                  {uploadAvatar.isPending ? 'Uploading...' : 'Upload Photo'}
                </Button>
                {profileImage && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setProfileImage(null)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            value={profileData.fullName}
            onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
            leftIcon={<User className="w-4 h-4" />}
          />
          <div>
            <Input
              label="Email Address"
              type="email"
              value={profileData.email}
              disabled
              leftIcon={<Mail className="w-4 h-4" />}
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          <Input
            label="Phone Number"
            value={profileData.phoneNumber}
            onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
            leftIcon={<Phone className="w-4 h-4" />}
          />
          <Input
            label="Date of Birth"
            type="date"
            value={profileData.dateOfBirth}
            onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
            leftIcon={<Calendar className="w-4 h-4" />}
          />
          <Input
            label="Tax ID (TIN)"
            value={profileData.taxId}
            onChange={(e) => setProfileData({ ...profileData, taxId: e.target.value })}
            leftIcon={<FileText className="w-4 h-4" />}
          />
          <Input
            label="Address"
            value={profileData.address}
            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
            leftIcon={<MapPin className="w-4 h-4" />}
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Card>
  );
}