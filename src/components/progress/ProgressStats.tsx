
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Clock, BookOpen, Award, TrendingUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProgressStatsProps {
  totalStudyTime: number;
  totalSessions: number;
  learnedCharacters: number;
  currentStreak: number;
  longestStreak: number;
}

const ProgressStats: React.FC<ProgressStatsProps> = ({
  totalStudyTime,
  totalSessions,
  learnedCharacters,
  currentStreak,
  longestStreak
}) => {
  const { user } = useAuth();
  const [weeklyGoalMinutes, setWeeklyGoalMinutes] = useState(105); // Default to ~15 minutes per day
  
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('daily_goal_minutes, weekly_goal_days')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching user settings:', error);
          return;
        }
        
        if (data) {
          // The data object now has the correct properties
          const dailyGoal = data.daily_goal_minutes || 15;
          const daysPerWeek = data.weekly_goal_days || 7;
          setWeeklyGoalMinutes(dailyGoal * daysPerWeek);
        }
      } catch (error) {
        console.error('Error in fetchUserSettings:', error);
      }
    };
    
    fetchUserSettings();
  }, [user]);
  
  // Format time in a more readable way
  const formatStudyTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`
      : `${hours} hour${hours !== 1 ? 's' : ''}`;
  };

  // Calculate weekly goal progress
  const goalProgress = Math.min(100, Math.round((totalStudyTime / weeklyGoalMinutes) * 100));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            Study Time (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="text-2xl font-bold">{formatStudyTime(totalStudyTime)}</div>
            <div className="mt-2 flex items-center">
              <div className="h-2 flex-grow bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo rounded-full" 
                  style={{ width: `${goalProgress}%` }}
                ></div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-xs text-muted-foreground ml-2">
                      {goalProgress}%
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Weekly goal: {weeklyGoalMinutes} minutes</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {totalSessions} {totalSessions === 1 ? 'session' : 'sessions'}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
            <BookOpen className="mr-2 h-4 w-4" />
            Characters Learned
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-baseline">
            {learnedCharacters}
            <TrendingUp className="ml-2 h-4 w-4 text-green-500" />
          </div>
          <div className="flex items-center mt-2">
            <div className="flex-grow h-2 bg-gray-100 rounded-full">
              <div 
                className={`h-full rounded-full ${
                  learnedCharacters > 46 ? 'bg-green-500' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, Math.round((learnedCharacters / 92) * 100))}%` }}
              ></div>
            </div>
            <span className="ml-2 text-xs text-muted-foreground">
              {Math.min(100, Math.round((learnedCharacters / 92) * 100))}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {learnedCharacters >= 92 
              ? 'Mastered both hiragana and katakana!' 
              : 'Basic kana mastery in progress'}
          </p>
        </CardContent>
      </Card>
      
      <Card className={currentStreak > 0 ? 'border-vermilion/20 bg-vermilion/5' : ''}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
            <Award className={`mr-2 h-4 w-4 ${currentStreak > 0 ? 'text-vermilion' : ''}`} />
            Learning Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <span className={currentStreak > 0 ? 'text-vermilion' : ''}>
              {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
            </span>
          </div>
          <div className="flex space-x-1 mt-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded ${
                  index < currentStreak ? 'bg-vermilion' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {currentStreak > 0
              ? currentStreak > longestStreak 
                ? 'New record! Keep going!' 
                : `Longest streak: ${longestStreak} days`
              : 'Start your streak by studying today!'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressStats;
