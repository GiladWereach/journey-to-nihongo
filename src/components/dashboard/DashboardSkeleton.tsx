
import React from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const DashboardSkeleton: React.FC = () => {
  return (
    <LoadingSpinner 
      size="md" 
      color="text-indigo" 
      label="Loading your profile..." 
      fullPage={true} 
    />
  );
};

export default DashboardSkeleton;
