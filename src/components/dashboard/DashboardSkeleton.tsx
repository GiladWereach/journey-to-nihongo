
import React from 'react';

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="flex flex-col items-center mt-36">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading your profile...</p>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
