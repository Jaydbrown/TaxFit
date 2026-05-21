import { AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface ErrorMessageProps {
  message?: string;
  title?: string;
  type?: 'inline' | 'banner';
  className?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ 
  message = 'An error occurred. Please try again.',
  title,
  type = 'inline',
  className,
  onRetry,
}: ErrorMessageProps) {
  if (type === 'banner') {
    return (
      <div className={cn('bg-red-50 border border-red-200 rounded-lg p-4', className)}>
        <div className="flex items-start">
          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="ml-3 flex-1">
            {title && (
              <h3 className="text-sm font-medium text-red-800 mb-1">{title}</h3>
            )}
            <p className="text-sm text-red-700">{message}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-3 text-sm font-medium text-red-800 hover:text-red-900 underline"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2 text-red-600', className)}>
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-2 text-sm font-medium hover:underline"
        >
          Retry
        </button>
      )}
    </div>
  );
}