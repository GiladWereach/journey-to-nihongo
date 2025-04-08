
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart2, Calendar, Award } from 'lucide-react';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { Profile } from '@/types/kana';
import { StudySession } from '@/types/dashboard';

interface ProgressOverviewProps {
  profile: Profile;
  studySessions: StudySession[];
  calculateStreak: () => number;
  totalStudyTime: number;
}

const ProgressOverview: React.FC<ProgressOverviewProps> = ({ 
  profile, 
  studySessions, 
  calculateStreak, 
  totalStudyTime 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-indigo mb-4 flex items-center">
          <BarChart2 className="mr-2 h-5 w-5 text-indigo" />
          Your Progress
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-softgray/30 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-800">Weekly Study Time</h3>
              <span className="text-xl font-bold text-indigo">{totalStudyTime} min</span>
            </div>
            <ProgressIndicator 
              progress={Math.min(100, (totalStudyTime / (profile.daily_goal_minutes * 7)) * 100)} 
              size="md" 
              color="bg-matcha" 
            />
            <p className="text-sm text-gray-600 mt-2">
              {totalStudyTime >= (profile.daily_goal_minutes * 7) 
                ? 'Great job! You met your weekly goal.'
                : `Goal: ${profile.daily_goal_minutes * 7} minutes per week`}
            </p>
          </div>
          
          <div className="bg-softgray/30 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-800">Study Streak</h3>
              <div className="flex items-center">
                <span className="text-xl font-bold text-vermilion mr-1">{calculateStreak()}</span>
                <span className="text-gray-600">days</span>
              </div>
            </div>
            <div className="flex space-x-1">
              {Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className={`h-8 flex-1 rounded ${
                    index < calculateStreak() ? 'bg-vermilion' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {calculateStreak() > 0 
                ? `You've studied ${calculateStreak()} days in a row!` 
                : 'Start your streak by studying today!'}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => navigate('/progress')}
            className="flex-1 bg-softgray hover:bg-softgray/80 text-gray-800"
          >
            <Calendar className="mr-2 h-4 w-4" />
            View Detailed Progress
          </Button>
          <Button
            onClick={() => navigate('/achievements')}
            className="flex-1 bg-softgray hover:bg-softgray/80 text-gray-800"
          >
            <Award className="mr-2 h-4 w-4" />
            Achievements
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProgressOverview;
