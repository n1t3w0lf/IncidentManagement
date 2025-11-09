// ============================================
// SPINNER COMPONENT
// ============================================

import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Spinner({ className, size = 'md', ...props }: SpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4',
  };

  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-solid border-primary-600 border-r-transparent',
        sizes[size],
        className
      )}
      role="status"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// ============================================
// LOADING OVERLAY
// ============================================

export interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export function LoadingOverlay({ isLoading, message = 'Loading...' }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="rounded-lg bg-white p-6 shadow-xl">
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="lg" />
          <p className="text-sm font-medium text-gray-700">{message}</p>
        </div>
      </div>
    </div>
  );
}
