import React from 'react';
import Card from '@/components/common/Card';
import type { User } from '@/types';

interface AccountInfoCardProps {
  user: User | null;
  className?: string;
}

export default function AccountInfoCard({ user, className = '' }: AccountInfoCardProps) {
  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
      <div className="space-y-3">
        <InfoItem label="User Type" value={user?.userType || 'N/A'} capitalize />
        <InfoItem label="Phone Number" value={user?.phoneNumber || 'Not provided'} />
        <InfoItem label="Referral Code" value={user?.referralCode || 'N/A'} />
        <InfoItem
          label="Member Since"
          value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 'N/A'}
        />
        <InfoItem
          label="Last Updated"
          value={user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 'N/A'}
        />
      </div>
    </Card>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
  capitalize?: boolean;
}

function InfoItem({ label, value, capitalize = false }: InfoItemProps) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm font-medium text-gray-900 ${capitalize ? 'capitalize' : ''}`}>
        {value}
      </span>
    </div>
  );
}