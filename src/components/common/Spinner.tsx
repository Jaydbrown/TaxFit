import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
}

export default function Spinner({ size = 'md', color = 'primary', className }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colors = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
    white: 'text-white',
    gray: 'text-gray-500',
  };

  return (
    <Loader2
      className={cn('animate-spin', sizes[size], colors[color], className)}
      aria-label="Loading"
    />
  );
}

// Loading spinner with message
interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullScreen?: boolean;
}

export function LoadingSpinner({ 
  message = 'Loading...', 
  size = 'lg',
  fullScreen = false 
}: LoadingSpinnerProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Spinner size={size} />
      {message && (
        <p className="text-sm text-gray-600 font-medium">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
}

// Button spinner (smaller, for button loading states)
export function ButtonSpinner({ className }: { className?: string }) {
  return <Spinner size="sm" className={cn('mr-2', className)} />;
}