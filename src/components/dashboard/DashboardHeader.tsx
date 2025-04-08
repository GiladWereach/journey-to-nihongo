
import React from 'react';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';

const DashboardHeader: React.FC = () => {
  return (
    <div className="flex items-center space-x-3 mb-8">
      <JapaneseCharacter character="ようこそ" size="md" color="text-indigo" />
      <h1 className="text-3xl font-bold text-indigo">Welcome Back!</h1>
    </div>
  );
};

export default DashboardHeader;
