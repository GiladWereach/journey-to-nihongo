
import React from 'react';
import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  label?: string;
  fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'text-indigo',
  className,
  label,
  fullPage = false,
}) => {
  // Size mappings
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  const spinnerSize = sizeMap[size];
  
  // If fullPage is true, center in viewport
  if (fullPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader className={cn(spinnerSize, color, 'animate-spin', className)} />
        {label && <p className="mt-4 text-gray-600">{label}</p>}
      </div>
    );
  }
  
  // Regular inline spinner
  return (
    <div className="flex flex-col items-center">
      <Loader className={cn(spinnerSize, color, 'animate-spin', className)} />
      {label && <p className="mt-2 text-sm text-gray-600">{label}</p>}
    </div>
  );
};

export default LoadingSpinner;
