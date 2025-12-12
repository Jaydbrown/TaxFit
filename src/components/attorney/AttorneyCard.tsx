import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Briefcase, DollarSign } from 'lucide-react';
import { Attorney } from '@/types';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import { formatCurrency } from '@/utils/helpers';

interface AttorneyCardProps {
  attorney: Attorney;
}

export default function AttorneyCard({ attorney }: AttorneyCardProps) {
  const { attorney: profile } = attorney;

  return (
    <Link
      to={`/find-attorney/${attorney.id}`}
      className="block bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
    >
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar
            src={attorney.avatarUrl}
            name={attorney.fullName}
            size="lg"
          />
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
              {attorney.fullName}
            </h3>
            <p className="text-sm text-gray-600 truncate">{profile.firmName}</p>
            
            {profile.rating && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm font-medium text-gray-900">
                    {profile.rating.toFixed(1)}
                  </span>
                </div>
                {profile.totalCases && (
                  <span className="text-sm text-gray-500">
                    ({profile.totalCases} cases)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {profile.specializations && profile.specializations.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.specializations.slice(0, 3).map((spec, index) => (
              <Badge key={index} variant="primary" size="sm">
                {spec}
              </Badge>
            ))}
            {profile.specializations.length > 3 && (
              <Badge variant="neutral" size="sm">
                +{profile.specializations.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="w-4 h-4 mr-1.5 flex-shrink-0" />
            <span>{profile.yearsOfExperience} years exp.</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
            <span className="truncate">License: {profile.professionalLicenseNumber}</span>
          </div>
        </div>


        {profile.bio && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {profile.bio}
          </p>
        )}


        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {profile.hourlyRate ? (
            <div className="flex items-center text-gray-900">
              <DollarSign className="w-4 h-4" />
              <span className="font-semibold">
                {formatCurrency(profile.hourlyRate)}/hr
              </span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">Rate not specified</span>
          )}
          
          <button
            onClick={(e) => {
              e.preventDefault();

            }}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Book Consultation
          </button>
        </div>
      </div>
    </Link>
  );
}