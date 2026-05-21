import { cn } from '@/utils/helpers';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
}

export default function Radio({
  name,
  options,
  value,
  onChange,
  label,
  error,
  orientation = 'vertical',
  disabled = false,
}: RadioProps) {
  return (
    <div className="flex flex-col">
      {label && (
        <label className="mb-2 text-sm font-medium text-gray-700">{label}</label>
      )}

      <div
        className={cn(
          'flex gap-4',
          orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
        )}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'flex items-start cursor-pointer group',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <div className="relative flex items-center">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange?.(e.target.value)}
                disabled={disabled}
                className="sr-only"
              />
              <div
                className={cn(
                  'w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-200',
                  value === option.value
                    ? 'border-primary-500'
                    : 'border-gray-300 group-hover:border-primary-500',
                  error && 'border-red-500'
                )}
              >
                {value === option.value && (
                  <div className="w-2.5 h-2.5 bg-primary-500 rounded-full" />
                )}
              </div>
            </div>

            <div className="ml-3 flex-1">
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {option.label}
              </span>
              {option.description && (
                <p className="text-sm text-gray-500 mt-0.5">{option.description}</p>
              )}
            </div>
          </label>
        ))}
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}