
import React from 'react';
import { Profile, UserSettings } from '@/types/kana';
import { StudySession, ContinueLearningData } from '@/types/dashboard';
import AssessmentPrompt from '@/components/dashboard/AssessmentPrompt';
import ContinueLearningCard from '@/components/dashboard/ContinueLearningCard';
import QuickPracticeSection from '@/components/dashboard/QuickPracticeSection';
import DashboardStatsSection from '@/components/dashboard/DashboardStatsSection';
import LearningModulesSection from '@/components/dashboard/LearningModulesSection';
import RecommendedNextSteps from '@/components/dashboard/RecommendedNextSteps';

interface DashboardMainContentProps {
  profile: Profile;
  settings: UserSettings | null;
  studySessions: StudySession[];
  showAssessmentPrompt: boolean;
  continueLearning: ContinueLearningData | null;
  hiraganaStats: { learned: number; total: number; avgProficiency: number };
  katakanaStats: { learned: number; total: number; avgProficiency: number };
  calculateStreak: () => number;
  totalStudyTime: number;
  signOut: () => void;
  handleModuleNavigation: (path: string, isReady?: boolean) => void;
  recommendedNextModule: ContinueLearningData | null;
}

const DashboardMainContent: React.FC<DashboardMainContentProps> = ({
  profile,
  settings,
  studySessions,
  showAssessmentPrompt,
  continueLearning,
  hiraganaStats,
  katakanaStats,
  calculateStreak,
  totalStudyTime,
  signOut,
  handleModuleNavigation,
  recommendedNextModule
}) => {
  return (
    <div className="flex flex-col items-center md:items-start">
      <AssessmentPrompt show={showAssessmentPrompt} />
      
      <ContinueLearningCard 
        continueLearning={continueLearning} 
        onContinue={handleModuleNavigation} 
      />
      
      <QuickPracticeSection onNavigate={handleModuleNavigation} />
      
      <DashboardStatsSection 
        profile={profile}
        signOut={signOut}
        studySessions={studySessions}
        calculateStreak={calculateStreak}
        totalStudyTime={totalStudyTime}
      />
      
      <LearningModulesSection 
        profile={profile}
        hiraganaStats={hiraganaStats}
        katakanaStats={katakanaStats}
        settings={settings}
        onNavigate={handleModuleNavigation}
      />
      
      <RecommendedNextSteps 
        showAssessmentPrompt={showAssessmentPrompt}
        recommendedNextModule={recommendedNextModule}
      />
    </div>
  );
};

export default DashboardMainContent;
