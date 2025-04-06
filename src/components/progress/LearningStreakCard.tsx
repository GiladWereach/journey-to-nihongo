
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Award, Calendar, Target, ArrowUp, Clock } from 'lucide-react';

interface LearningStreakCardProps {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: Date | null;
  className?: string;
}

const LearningStreakCard: React.FC<LearningStreakCardProps> = ({
  currentStreak,
  longestStreak,
  lastPracticeDate,
  className
}) => {
  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Calculate streak status
  const getStreakStatus = () => {
    if (!lastPracticeDate) return 'inactive';
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastPracticeDate.toDateString() === today.toDateString()) {
      return 'active';
    } else if (lastPracticeDate.toDateString() === yesterday.toDateString()) {
      return 'warning'; // Streak will break if not practiced today
    } else {
      return 'broken'; // Streak is already broken
    }
  };

  const streakStatus = getStreakStatus();
  
  // Calculate streak percentage of goal (assuming goal is 30 days or longest streak if higher)
  const streakGoal = Math.max(30, longestStreak);
  const streakPercentage = Math.min(100, Math.round((currentStreak / streakGoal) * 100));
  
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-vermilion" />
            <h3 className="text-lg font-semibold">Learning Streak</h3>
          </div>
          
          {streakStatus === 'active' && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              <Clock className="h-3 w-3 mr-1" />
              Active Today
            </span>
          )}
          {streakStatus === 'warning' && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
              <Clock className="h-3 w-3 mr-1" />
              Practice Today!
            </span>
          )}
          {streakStatus === 'broken' && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
              <Calendar className="h-3 w-3 mr-1" />
              Streak Broken
            </span>
          )}
        </div>
        
        {/* Progress bar for streak visualization */}
        <div className="mb-4">
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-vermilion rounded-full"
              style={{ width: `${streakPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>0 days</span>
            <span>{streakGoal} days goal</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-softgray/30 p-3 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
            {currentStreak > 0 && (
              <div className="absolute inset-0 bg-gradient-to-t from-vermilion/10 to-transparent opacity-50"></div>
            )}
            <div className="flex items-center gap-2 mb-1 z-10">
              <Flame className={`h-4 w-4 ${currentStreak > 0 ? 'text-vermilion' : 'text-gray-400'}`} />
              <span className="text-sm text-muted-foreground">Current</span>
            </div>
            <span className="text-2xl font-bold z-10">{currentStreak}</span>
            <span className="text-xs text-muted-foreground z-10">days</span>
            {currentStreak > 0 && currentStreak >= longestStreak && (
              <div className="absolute top-1 right-1">
                <ArrowUp className="h-3 w-3 text-green-500" />
              </div>
            )}
          </div>
          
          <div className="bg-softgray/30 p-3 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
            {longestStreak > 0 && (
              <div className="absolute inset-0 bg-gradient-to-t from-indigo/10 to-transparent opacity-50"></div>
            )}
            <div className="flex items-center gap-2 mb-1 z-10">
              <Award className={`h-4 w-4 ${longestStreak > 0 ? 'text-indigo' : 'text-gray-400'}`} />
              <span className="text-sm text-muted-foreground">Longest</span>
            </div>
            <span className="text-2xl font-bold z-10">{longestStreak}</span>
            <span className="text-xs text-muted-foreground z-10">days</span>
          </div>
          
          <div className="col-span-2 sm:col-span-1 bg-softgray/30 p-3 rounded-lg flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-muted-foreground">Last Practice</span>
            </div>
            <span className={`text-lg font-medium ${
              streakStatus === 'active' ? 'text-green-600' : 
              streakStatus === 'warning' ? 'text-amber-600' : 'text-gray-600'
            }`}>
              {formatDate(lastPracticeDate)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningStreakCard;
