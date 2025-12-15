import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Filter,
  Loader2,
  MapPin,
  Star,
  Briefcase,
  TrendingUp,
  ArrowRight,
  Award
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import Layout from '@/components/layout/Layout';
import SearchBar from '@/components/common/SearchBar';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';

import { useAuthStore } from '@/store/auth-store';
import { formatCurrency } from '@/utils/helpers';
import { handleApiError } from '@/lib/api-client';

import { useAttorneys } from '@/hooks/attorney/use-attorneys';
import type { AttorneySearchResultItem } from '@/types/attorney';


interface AttorneyCardProps {
  attorney: AttorneySearchResultItem;
}

function AttorneyCard({ attorney }: AttorneyCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

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

  const ratingValue =
    profile.averageRating > 0
      ? profile.averageRating.toFixed(1)
      : 'N/A';

  const reviewCount = profile.totalReviews ?? 0;

  const locationText =
    profile.availability?.timezone ?? 'Nigeria';

  const specializations = profile.specializations ?? [];

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer rounded-lg shadow-sm overflow-hidden"
    >
      <div className="p-8 md:p-12">
        {/* Header */}
        <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-100">
          <Avatar
            src={attorney.avatarUrl ?? undefined}
            name={attorney.fullName}
            size="lg"
            className="w-20 h-20"
          />

          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
              {attorney.fullName}
            </h3>

            <div className="text-sm text-primary-600 font-light mb-4">
              {profile.firmName}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium text-gray-900">
                  {ratingValue}
                </span>
                <span className="text-gray-500">
                  ({reviewCount})
                </span>
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
          <div className="text-xs uppercase tracking-wider text-gray-500 mb-4">
            Specializations
          </div>

          <div className="flex flex-wrap gap-2">
            {specializations.slice(0, 4).map((spec, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-sm text-gray-700 rounded"
              >
                {spec}
              </span>
            ))}

            {specializations.length > 4 && (
              <span className="px-3 py-1.5 bg-gray-100 text-sm text-gray-600 rounded">
                +{specializations.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Bio */}
        <p className="text-base text-gray-600 leading-relaxed mb-8 line-clamp-3">
          {profile.bio ??
            'This attorney has not provided a detailed biography yet.'}
        </p>

        {/* Performance */}
        <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs uppercase tracking-wider text-gray-500">
                Response Rate
              </span>
            </div>
            <div className="text-3xl font-light text-gray-900">
              {profile.responseRate > 0
                ? `${profile.responseRate}%`
                : 'N/A'}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-primary-600" />
              <span className="text-xs uppercase tracking-wider text-gray-500">
                Consultations
              </span>
            </div>
            <div className="text-3xl font-light text-gray-900">
              {profile.completedConsultations > 0
                ? `${profile.completedConsultations}+`
                : 'N/A'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">
              Hourly Rate
            </div>
            <div className="text-2xl font-light text-gray-900">
              {formatCurrency(profile.hourlyRate)}
              <span className="text-sm text-gray-500">/hr</span>
            </div>
          </div>

          <button
            onClick={handleHireClick}
            className="px-6 py-3 bg-secondary-900 hover:bg-secondary-800 text-white rounded-lg"
          >
            <span className="flex items-center gap-2">


              {isAuthenticated ? 'Hire Attorney' : 'Sign in to Hire'})
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
export default function FindAttorneyPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);

  const {
    data: attorneys = [],
    isLoading,
    isFetching,
    isError,
    error
  } = useAttorneys();

  const showLoading = isLoading || isFetching;

  if (isError) {
    toast.error(handleApiError(error));

    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="py-24 border-b border-gray-200">
          <div className="container mx-auto px-6">
            <h1 className="text-6xl font-extralight text-gray-900 mb-6">
              Connect with <span className="italic text-primary-600">expert attorneys</span>
            </h1>

            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={() => {}}
              placeholder="Search attorneys..."
              size="lg"
              className="max-w-3xl"
            />
          </div>
        </section>

        {/* Results */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            {showLoading ? (
              <div className="text-center py-16">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                Loading attorneys...
              </div>
            ) : attorneys.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {attorneys.map(attorney => (
                  <AttorneyCard
                    key={attorney.id}
                    attorney={attorney}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">
                No attorneys found.
              </p>
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
}
