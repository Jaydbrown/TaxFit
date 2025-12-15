import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
  // 🎯 FIX: Added the leftIcon property
  leftIcon?: React.ReactNode; 
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder,
      className,
      fullWidth = true,
      disabled,
      // 🎯 FIX: Destructure the new leftIcon prop
      leftIcon, 
      ...props
    },
    ref
  ) => {
    // Determine the left padding class based on the presence of leftIcon
    const paddingLeftClass = leftIcon ? 'pl-10 pr-10' : 'pl-4 pr-10';
      
    return (
      <div className={cn('flex flex-col', fullWidth && 'w-full')}>
        {label && (
          <label className="mb-1.5 text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {/* 🎯 FIX: Render the leftIcon if provided */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400 z-10">
              {leftIcon}
            </div>
          )}

          <select
            ref={ref}
            className={cn(
              'w-full py-2.5 border rounded-lg appearance-none transition-all duration-200',
              // 🎯 FIX: Use the calculated padding class
              paddingLeftClass, 
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'disabled:bg-gray-100 disabled:cursor-not-allowed',
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300',
              className
            )}
            disabled={disabled}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* ChevronDown remains on the right */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>

        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}

        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;