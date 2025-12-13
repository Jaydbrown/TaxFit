import React from 'react';
import { User as UserIcon, Mail, Phone, Calendar, Briefcase, Save, Loader2, MapPin } from 'lucide-react';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import type { User, IndividualProfile } from '@/types';

interface ProfileFormProps {
  user: User | null;
  individualProfile?: IndividualProfile;
  isEditing: boolean;
  isUpdating: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    fullName: string;
    phoneNumber: string;
    employmentStatus: string;
    occupation: string;
    dateOfBirth: string;
    address: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export default function ProfileForm({
  user,
  individualProfile,
  isEditing,
  isUpdating,
  onEdit,
  onCancel,
  onSubmit,
  formData,
  onInputChange,
}: ProfileFormProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
        {!isEditing && (
          <Button variant="outline" onClick={onEdit} size="sm">
            Edit Profile
          </Button>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            leftIcon={<UserIcon className="w-5 h-5" />}
            value={formData.fullName}
            onChange={(e) => onInputChange('fullName', e.target.value)}
            disabled={!isEditing}
            required
          />

          <Input
            label="Email Address"
            type="email"
            leftIcon={<Mail className="w-5 h-5" />}
            value={user?.email || ''}
            disabled
            className="bg-gray-50"
            helper="Email cannot be changed"
          />

          <Input
            label="Phone Number"
            type="tel"
            leftIcon={<Phone className="w-5 h-5" />}
            value={formData.phoneNumber}
            onChange={(e) => onInputChange('phoneNumber', e.target.value)}
            disabled={!isEditing}
            placeholder="+234 800 000 0000"
          />

          <Input
            label="Date of Birth"
            type="date"
            leftIcon={<Calendar className="w-5 h-5" />}
            value={formData.dateOfBirth}
            onChange={(e) => onInputChange('dateOfBirth', e.target.value)}
            disabled={!isEditing}
          />
        </div>

        {/* Individual Profile Fields */}
        {user?.userType === 'individual' && (
          <>
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-gray-600" />
                Employment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Employment Status"
                  value={formData.employmentStatus}
                  onChange={(e) => onInputChange('employmentStatus', e.target.value)}
                  disabled={!isEditing}
                  options={[
                    { value: '', label: 'Select status' },
                    { value: 'employed', label: 'Employed' },
                    { value: 'self-employed', label: 'Self-Employed' },
                    { value: 'unemployed', label: 'Unemployed' },
                    { value: 'student', label: 'Student' },
                    { value: 'retired', label: 'Retired' },
                  ]}
                />

                <Input
                  label="Occupation"
                  leftIcon={<Briefcase className="w-5 h-5" />}
                  value={formData.occupation}
                  onChange={(e) => onInputChange('occupation', e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g., Software Developer"
                />
              </div>
            </div>

            <Input
              label="Address"
              leftIcon={<MapPin className="w-5 h-5" />}
              value={formData.address}
              onChange={(e) => onInputChange('address', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter your full address"
            />
          </>
        )}

        {/* Attorney Profile Fields */}
        {user?.userType === 'attorney' && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Professional Information
            </h3>
            <p className="text-sm text-gray-600">
              Attorney profile details can be managed separately in the Attorney Dashboard.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              leftIcon={isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </form>
    </Card>
  );
}