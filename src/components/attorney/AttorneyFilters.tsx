import React from 'react';
import { Filter, X } from 'lucide-react';
import { AttorneySearchFilters } from '@/types';
import Select from '@/components/common/Select';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { formatCurrency } from '@/utils/helpers'; // Assuming you have this helper

// --- DEFINITIONS ---
interface AttorneyFiltersProps {
  filters: AttorneySearchFilters;
  onFilterChange: (filters: AttorneySearchFilters) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const specializationOptions = [
  { value: 'tax-law', label: 'Tax Law' },
  { value: 'corporate-tax', label: 'Corporate Tax' },
  { value: 'personal-tax', label: 'Personal Tax' },
  { value: 'international-tax', label: 'International Tax' },
  { value: 'estate-planning', label: 'Estate Planning' },
  { value: 'audit-defense', label: 'Audit Defense' },
];

const locationOptions = [
  { value: 'lagos', label: 'Lagos' },
  { value: 'abuja', label: 'Abuja' },
  { value: 'port-harcourt', label: 'Port Harcourt' },
  { value: 'kano', label: 'Kano' },
  { value: 'ibadan', label: 'Ibadan' },
  { value: 'online', label: 'Online / Remote' },
];

// --- COMPONENT ---
export default function AttorneyFilters({ 
  filters, 
  onFilterChange,
  isOpen = true,
  onClose,
}: AttorneyFiltersProps) {
    
  // Helper function to safely handle change for a single key
  const handleChange = (key: keyof AttorneySearchFilters, value: any) => {
    // If the value is an empty string, null, or zero for a numeric field, treat it as undefined
    const finalValue = (key === 'minExperience' || key === 'maxRate' || key === 'rating') 
        ? (value === '' || value === 0 ? undefined : Number(value)) 
        : (value === '' ? undefined : value);

    onFilterChange({ ...filters, [key]: finalValue });
  };
    
  // Correctly resets all filter fields to undefined, preserving searchQuery
  const clearFilters = () => {
    const { searchQuery, limit, page, ...rest } = filters;
    
    // Create an object with all filter keys set to undefined
    const resetFilters: Partial<AttorneySearchFilters> = Object.keys(rest).reduce((acc, key) => {
        (acc as any)[key] = undefined;
        return acc;
    }, {});

    onFilterChange({
        ...filters,
        ...resetFilters,
        // Preserve essential query parameters
        searchQuery: filters.searchQuery || undefined,
        page: 1, 
    });
  };

  // Determine if any filter other than searchQuery, page, or limit is active
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => 
    key !== 'searchQuery' && key !== 'page' && key !== 'limit' && value !== undefined && value !== ''
  );

  return (
    <Card 
        className={`sticky top-4 transition-all duration-300 ${isOpen ? 'block' : 'hidden'} lg:block`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-lg">Filters</h3>
        </div>
        {/* Close button for mobile view */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Specialization */}
        <Select
          label="Specialization"
          placeholder="Any specialization"
          options={[{ value: '', label: 'Any specialization' }, ...specializationOptions]}
          value={filters.specialization || ''}
          onChange={(e) => handleChange('specialization', e.target.value)}
        />

        {/* Location */}
        <Select
          label="Location"
          placeholder="Any location"
          options={[{ value: '', label: 'Any location' }, ...locationOptions]}
          value={filters.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
        />

        {/* Minimum Experience (Numeric Input) */}
        <Input
          label="Minimum Experience (years)"
          type="number"
          min="0"
          placeholder="0"
          value={filters.minExperience || ''}
          // The handleChange function handles the Number conversion
          onChange={(e) => handleChange('minExperience', e.target.value)}
        />

        {/* Maximum Hourly Rate (Numeric Input) */}
        <Input
          label="Maximum Hourly Rate (₦)"
          type="number"
          min="0"
          placeholder="Any rate"
          value={filters.maxRate || ''}
          onChange={(e) => handleChange('maxRate', e.target.value)}
        />

        {/* Minimum Rating Buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleChange('rating', rating)}
                className={`flex-1 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  filters.rating === rating
                    ? 'bg-primary-600 text-white border-primary-600' // Changed to a stronger primary color
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
                }`}
              >
                {rating}★
              </button>
            ))}
          </div>
        </div>

        {/* Clear All Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            fullWidth
            onClick={clearFilters}
            leftIcon={<X className="w-4 h-4" />}
            className="mt-6"
          >
            Clear All Filters
          </Button>
        )}
      </div>

      {/* Active Filters Display Section */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3 font-medium">Applied Filters:</p>
          <div className="flex flex-wrap gap-2">
            
            {/* Specialization */}
            {filters.specialization && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                {specializationOptions.find(o => o.value === filters.specialization)?.label}
                <button type="button" onClick={() => handleChange('specialization', undefined)} className="p-0.5 hover:bg-primary-200 rounded-full">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {/* Location */}
            {filters.location && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                {locationOptions.find(o => o.value === filters.location)?.label}
                <button type="button" onClick={() => handleChange('location', undefined)} className="p-0.5 hover:bg-primary-200 rounded-full">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {/* Min Experience */}
            {filters.minExperience && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                {filters.minExperience}+ years
                <button type="button" onClick={() => handleChange('minExperience', undefined)} className="p-0.5 hover:bg-primary-200 rounded-full">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {/* Max Rate */}
            {filters.maxRate && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                Max Rate: {formatCurrency(filters.maxRate)}
                <button type="button" onClick={() => handleChange('maxRate', undefined)} className="p-0.5 hover:bg-primary-200 rounded-full">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {/* Min Rating */}
            {filters.rating && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                {filters.rating}★+
                <button type="button" onClick={() => handleChange('rating', undefined)} className="p-0.5 hover:bg-primary-200 rounded-full">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}