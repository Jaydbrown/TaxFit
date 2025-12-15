import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// src/utils/helpers.ts

/**
 * Formats a number into a currency string (e.g., $1,200.00).
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

/**
 * Formats an ISO 8601 string into a readable date (e.g., Dec 15, 2025).
 */
export const formatDate = (isoString: string): string => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

/**
 * FIX: Function needed to resolve the Uncaught SyntaxError.
 * Formats an ISO 8601 string into a readable time (e.g., 10:00 AM).
 */
export const formatTime = (isoString: string): string => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true, // Use 12-hour format with AM/PM
    });
};

// Add any other general utility functions here...

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

