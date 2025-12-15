import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // FIX: Added 'link' to the variant union type to resolve the TypeScript error
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'link'; 
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500',
    secondary: 'bg-secondary-700 hover:bg-secondary-800 text-white focus:ring-secondary-700',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-600',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-600',
    // FIX: Added the 'link' variant style for a text-only, underlined button
    link: 'text-primary-600 hover:text-primary-800 bg-transparent underline-offset-4 hover:underline focus:ring-transparent p-0 h-auto',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    // For link variant, we override padding/height with the link style, 
    // but the size definition provides the font size for consistency.
  };

  // Special handling for link size: We don't want the default padding/height
  const linkSizeStyles = variant === 'link' ? `text-${size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'base'}` : sizes[size];
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        linkSizeStyles, // Use link size handling
        fullWidth && 'w-full',
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}