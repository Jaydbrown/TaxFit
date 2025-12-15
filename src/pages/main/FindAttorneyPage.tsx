import React from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Filter, Loader2, MapPin, Star, Briefcase, TrendingUp, ArrowRight, Award } from 'lucide-react';
import { toast } from 'react-hot-toast'; 
import SearchBar from '@/components/common/SearchBar';
import Button from '@/components/common/Button';
import Layout from '@/components/layout/Layout';
import Avatar from '@/components/common/Avatar';
import { useAuthStore } from '@/store/auth-store';
import { formatCurrency } from '@/utils/helpers';
import { handleApiError } from '@/lib/api-client';
import { useAttorneySearch } from '@/hooks/attorney/use-attorney-search'; 
import type { Attorney, AttorneySearchFilters } from '@/types'; 

interface AttorneyCardProps {
  attorney: Attorney; // Use the combined type
}

function AttorneyCard({ attorney }: AttorneyCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  // Access the nested profile data
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
  const locationText = profile.location || profile.state || 'N/A';
  const specializations = profile.specializations || [];

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer rounded-lg shadow-sm overflow-hidden"
    >
      <div className="p-8 md:p-12">
        {/* Header */}
        <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-100">
          <div className="flex-shrink-0">
            <Avatar 
                src={attorney.avatarUrl ?? undefined} 
                name={attorney.fullName} 
                size="lg"
                className="w-20 h-20"
            />
          </div>

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
// --- End AttorneyCard Component ---


export default function FindAttorneyPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = React.useState(initialQuery);
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);
  
  const [filters, setFilters] = React.useState<AttorneySearchFilters>({
    searchQuery: initialQuery,
    page: 1, 
    limit: 20,
  });

  // Call the API hook
  const { data, isLoading, isFetching, error, isError } = useAttorneySearch(filters);
  
  const attorneys = data?.attorneys || [];
  const totalResults = data?.total || 0;

  const handleSearch = () => {
    setFilters(prev => ({ 
        ...prev, 
        searchQuery: searchQuery,
        page: 1, 
    }));
  };

  React.useEffect(() => {
    if (initialQuery && initialQuery !== filters.searchQuery) {
      handleSearch();
    }
  }, [initialQuery]);

  const showLoading = isLoading || isFetching;

  // --- ERROR HANDLING BLOCK ---
  if (isError) {
    console.error("Failed to load attorneys from API:", error);
    toast.error(`Error fetching attorneys: ${handleApiError(error)}`);

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center py-24 px-4 max-w-lg bg-white rounded-lg shadow-xl border border-red-200">
                    <h2 className="text-3xl font-semibold text-red-700 mb-4">Connection Error</h2>
                    <p className="text-gray-600 mb-6">
                        We were unable to load the list of attorneys. Please check your network connection or try refreshing the page.
                    </p>
                    <Button 
                        onClick={() => window.location.reload()} 
                        className="mt-6 bg-red-600 hover:bg-red-700 text-white"
                    >
                        Refresh Page
                    </Button>
                </div>
            </div>
        </Layout>
    );
  }
  // --- END ERROR HANDLING BLOCK ---

  return (
    <Layout>
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-white py-24 border-b border-gray-200">
          <div className="container mx-auto px-6 md:px-12 lg:px-16">
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-px w-16 bg-primary-500"></div>
                  <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-light">
                    Attorney Directory
                  </span>
                </div>

                <h1 className="text-6xl md:text-7xl font-extralight text-gray-900 tracking-tight leading-[0.95]">
                  Connect with
                  <br />
                  <span className="italic font-light text-primary-600">expert advisors</span>
                </h1>

                <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl">
                  Browse our network of qualified tax attorneys. View profiles, check credentials, 
                  and find the perfect partner for your tax strategy.
                </p>

                <div className="inline-block px-4 py-2 bg-blue-50 border border-blue-200 text-sm text-blue-800 font-light rounded">
                  <strong>Note:</strong> You can browse attorneys freely. Sign in required to hire.
                </div>
              </div>

              <div className="pt-8 border-t border-gray-200">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={handleSearch}
                  placeholder="Search by name, specialization, or location..."
                  size="lg"
                  className="max-w-3xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6 md:px-12 lg:px-16">
            <div className="flex items-center justify-between mb-12 pb-6 border-b border-gray-200">
              <div>
                <div className="text-3xl font-light text-gray-900 mb-1">
                  {showLoading ? '...' : totalResults}
                </div>
                <div className="text-xs uppercase tracking-wider text-gray-500">
                  {totalResults === 1 ? 'Attorney' : 'Attorneys'} found
                </div>
              </div>
              <div className="md:hidden">
                <Button
                  variant="outline"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Attorney Grid */}
            {showLoading ? (
              <div className="text-center py-16">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
                <p className="text-xl text-gray-600 font-light">Loading top attorneys...</p>
              </div>
            ) : attorneys.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {attorneys.map((attorney) => (
                  <AttorneyCard key={attorney.id} attorney={attorney} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600 font-light">
                  No attorneys found matching your search criteria.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Try adjusting your keywords, specialization, or location filters.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
}