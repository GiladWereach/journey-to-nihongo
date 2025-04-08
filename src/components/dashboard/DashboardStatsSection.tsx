
import React from 'react';
import { Profile } from '@/types/kana';
import { StudySession } from '@/types/dashboard';
import ProfileCard from '@/components/dashboard/ProfileCard';
import ProgressOverview from '@/components/dashboard/ProgressOverview';

interface DashboardStatsSectionProps {
  profile: Profile;
  signOut: () => void;
  studySessions: StudySession[];
  calculateStreak: () => number;
  totalStudyTime: number;
}

const DashboardStatsSection: React.FC<DashboardStatsSectionProps> = ({
  profile,
  signOut,
  studySessions,
  calculateStreak,
  totalStudyTime
}) => {
  return (
    <div className="w-full max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1">
          <ProfileCard profile={profile} signOut={signOut} />
        </div>
        
        <div className="md:col-span-2">
          <ProgressOverview 
            profile={profile} 
            studySessions={studySessions}
            calculateStreak={calculateStreak}
            totalStudyTime={totalStudyTime}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardStatsSection;
