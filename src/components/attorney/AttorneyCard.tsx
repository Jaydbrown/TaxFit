import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Briefcase, TrendingUp, ArrowRight, Award } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

interface AttorneyCardProps {
  attorney: {
    id: string;
    fullName: string;
    firmName: string;
    location: string;
    state: string;
    yearsOfExperience: number;
    hourlyRate: number;
    rating: number;
    reviewCount: number;
    specializations: string[];
    bio: string;
    successRate: number;
    casesHandled: number;
    avatarUrl: string | null;
  };
}

export default function AttorneyCard({ attorney }: AttorneyCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

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

  // Get initials for avatar
  const initials = attorney.fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer"
    >
      {/* Main Content */}
      <div className="p-8 md:p-12">
        {/* Header */}
        <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-100">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <span className="text-2xl font-light text-white">{initials}</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
              {attorney.fullName}
            </h3>
            <div className="text-sm text-primary-600 font-light mb-4">
              {attorney.firmName}
            </div>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium text-gray-900">{attorney.rating}</span>
                <span className="text-gray-500">({attorney.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{attorney.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                <span>{attorney.yearsOfExperience} years</span>
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
            {attorney.specializations.slice(0, 4).map((spec, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-sm text-gray-700 font-light hover:border-gray-300 transition-colors"
              >
                {spec}
              </span>
            ))}
            {attorney.specializations.length > 4 && (
              <span className="px-3 py-1.5 bg-gray-100 text-sm text-gray-600 font-light">
                +{attorney.specializations.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Bio */}
        <p className="text-base text-gray-600 font-light leading-relaxed mb-8 line-clamp-3">
          {attorney.bio}
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
              {attorney.successRate}%
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
              {attorney.casesHandled}+
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
              ₦{attorney.hourlyRate.toLocaleString()}
              <span className="text-sm text-gray-500 font-light">/hr</span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleHireClick}
            className="flex-shrink-0 group/btn px-6 py-3 bg-secondary-900 hover:bg-secondary-800 text-white transition-colors"
          >
            <span className="flex items-center gap-2 text-sm">
              <span>{isAuthenticated ? 'Hire' : 'Sign in to Hire'}</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>

        {/* Login Notice for Guests */}
        {!isAuthenticated && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-start gap-3 p-3 bg-blue-50 border-l-2 border-blue-500">
              <div className="flex-1">
                <div className="text-xs text-blue-900 font-light">
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