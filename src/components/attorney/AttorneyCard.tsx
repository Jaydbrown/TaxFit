import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Star, Briefcase, TrendingUp, ArrowRight, Award } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import Avatar from '@/components/common/Avatar'; 
import { formatCurrency } from '@/utils/helpers'; 

interface AttorneyCardProps {
  attorney: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    
    // AttorneyProfile fields (nested in the Attorney type)
    attorneyProfile: {
        firmName: string;
        location?: string; // Optional/fallback
        state?: string; // Optional/fallback
        yearsOfExperience: number;
        hourlyRate: number;
        rating?: number;
        totalReviews?: number; // Used reviewCount here
        specializations?: string[];
        bio?: string;
        successRate?: number; // Used successRate here
        totalCases?: number; // Used casesHandled here
    }
  };
}

export default function AttorneyCard({ attorney }: AttorneyCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  // Use the nested profile data for display
  const profile = attorney.attorneyProfile;

  const handleCardClick = () => {
    navigate(`/attorney/${attorney.id}`);
  };

  const handleHireClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAuthenticated) {
      navigate(`/attorney/${attorney.id}/hire`);
    } else {
      navigate(`/login?redirect=/attorney/${attorney.id}`);
    }
  };

  // Safe access to potentially optional data
  const ratingValue = profile.rating?.toFixed(1) || 'N/A';
  const reviewCount = profile.totalReviews || 0;
  const locationText = profile.location || profile.state || 'Nigeria';
  const specializations = profile.specializations || [];

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer rounded-lg shadow-sm overflow-hidden"
    >
      {/* Main Content */}
      <div className="p-8 md:p-12">
        {/* Header */}
        <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-100">
          {/* Avatar (Using assumed Avatar component) */}
          <div className="flex-shrink-0">
            <Avatar 
                src={attorney.avatarUrl ?? undefined} 
                name={attorney.fullName} 
                size="lg" // Assuming 'lg' corresponds to w-20 h-20
                className="w-20 h-20"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
              {attorney.fullName}
            </h3>
            <div className="text-sm text-primary-600 font-light mb-4">
              {profile.firmName}
            </div>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium text-gray-900">{ratingValue}</span>
                <span className="text-gray-500">({reviewCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{locationText}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                <span>{profile.yearsOfExperience} years</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specializations */}
        <div className="mb-8">
          <div className="text-xs uppercase tracking-wider text-gray-500 font-light mb-4">
            Specializations
          </div>
          <div className="flex flex-wrap gap-2">
            {specializations.slice(0, 4).map((spec, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-sm text-gray-700 font-light hover:border-gray-300 transition-colors rounded"
              >
                {spec}
              </span>
            ))}
            {specializations.length > 4 && (
              <span className="px-3 py-1.5 bg-gray-100 text-sm text-gray-600 font-light rounded">
                +{specializations.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Bio */}
        <p className="text-base text-gray-600 font-light leading-relaxed mb-8 line-clamp-3">
          {profile.bio || "This attorney has not provided a detailed biography yet."}
        </p>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs uppercase tracking-wider text-gray-500 font-light">
                Success Rate
              </span>
            </div>
            <div className="text-3xl font-light text-gray-900">
              {profile.successRate ? `${profile.successRate}%` : 'N/A'}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-primary-600" />
              <span className="text-xs uppercase tracking-wider text-gray-500 font-light">
                Cases Handled
              </span>
            </div>
            <div className="text-3xl font-light text-gray-900">
              {profile.totalCases ? `${profile.totalCases}+` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-6">
          {/* Rate */}
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-500 font-light mb-1">
              Hourly Rate
            </div>
            <div className="text-2xl font-light text-gray-900">
              {formatCurrency(profile.hourlyRate)}
              <span className="text-sm text-gray-500 font-light">/hr</span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleHireClick}
            className="flex-shrink-0 group/btn px-6 py-3 bg-secondary-900 hover:bg-secondary-800 text-white transition-colors rounded-lg"
          >
            <span className="flex items-center gap-2 text-base">
              <span>{isAuthenticated ? 'Hire Attorney' : 'Sign in to Hire'}</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>

        {/* Login Notice for Guests */}
        {!isAuthenticated && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-start gap-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <div className="flex-1">
                <div className="text-sm text-blue-900 font-light">
                  Sign in required to hire or contact this attorney
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}