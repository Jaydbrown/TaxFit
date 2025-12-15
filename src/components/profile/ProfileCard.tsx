import React from 'react';
import { Camera, Loader2 } from 'lucide-react';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import type { User } from '@/types';

interface ProfileCardProps {
  user: User | null;
  isUploading?: boolean;
  onImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileCard({ user, isUploading = false, onImageUpload }: ProfileCardProps) {
  return (
    <Card>
      <div className="text-center">
        {/* Avatar with Upload Button */}
        <div className="relative inline-block mb-4">
          <Avatar
            src={user?.avatarUrl}
            name={user?.fullName || 'User'}
            size="2xl"
          />
          
          {onImageUpload && (
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-0 right-0 w-10 h-10 bg-primary-600 hover:bg-primary-700 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-lg ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Change profile picture"
            >
              {isUploading ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Camera className="w-5 h-5 text-white" />
              )}
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={onImageUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          )}
        </div>

        {/* User Info */}
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          {user?.fullName || 'User'}
        </h2>
        <p className="text-gray-600 mb-4">{user?.email}</p>

        {/* Badges */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Badge variant={user?.isPremium ? 'success' : 'neutral'}>
            {user?.isPremium ? 'Premium' : 'Free'}
          </Badge>
          <Badge variant={user?.isEmailVerified ? 'success' : 'warning'}>
            {user?.isEmailVerified ? 'Verified' : 'Unverified'}
          </Badge>
          <Badge variant="neutral" className="capitalize">
            {user?.userType || 'User'}
          </Badge>
        </div>
      </div>
    </Card>
  );
}