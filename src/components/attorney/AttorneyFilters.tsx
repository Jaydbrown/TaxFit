import React from 'react';
import { Filter, X } from 'lucide-react';
import { AttorneySearchFilters } from '@/types';
import Select from '@/components/common/Select';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

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

export default function AttorneyFilters({ 
  filters, 
  onFilterChange,
  isOpen = true,
  onClose,
}: AttorneyFiltersProps) {
  const handleChange = (key: keyof AttorneySearchFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');

  return (
    <Card className={`sticky top-4 ${!isOpen && 'hidden lg:block'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-lg">Filters</h3>
        </div>
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
        <Select
          label="Specialization"
          placeholder="Any specialization"
          options={[{ value: '', label: 'Any specialization' }, ...specializationOptions]}
          value={filters.specialization || ''}
          onChange={(e) => handleChange('specialization', e.target.value)}
        />

        <Select
          label="Location"
          placeholder="Any location"
          options={[{ value: '', label: 'Any location' }, ...locationOptions]}
          value={filters.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
        />

        <Input
          label="Minimum Experience (years)"
          type="number"
          min="0"
          placeholder="0"
          value={filters.minExperience || ''}
          onChange={(e) => handleChange('minExperience', e.target.value ? Number(e.target.value) : undefined)}
        />

        <Input
          label="Maximum Hourly Rate (₦)"
          type="number"
          min="0"
          placeholder="Any rate"
          value={filters.maxRate || ''}
          onChange={(e) => handleChange('maxRate', e.target.value ? Number(e.target.value) : undefined)}
        />

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
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
                }`}
              >
                {rating}★
              </button>
            ))}
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            fullWidth
            onClick={clearFilters}
            leftIcon={<X className="w-4 h-4" />}
          >
            Clear All Filters
          </Button>
        )}
      </div>
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Active filters:</p>
          <div className="flex flex-wrap gap-2">
            {filters.specialization && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                {specializationOptions.find(o => o.value === filters.specialization)?.label}
                <button onClick={() => handleChange('specialization', undefined)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.location && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                {locationOptions.find(o => o.value === filters.location)?.label}
                <button onClick={() => handleChange('location', undefined)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.minExperience && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                {filters.minExperience}+ years
                <button onClick={() => handleChange('minExperience', undefined)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.rating && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                {filters.rating}★+
                <button onClick={() => handleChange('rating', undefined)}>
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