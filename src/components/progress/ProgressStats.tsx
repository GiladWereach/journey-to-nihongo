
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Clock, BookOpen, Award, TrendingUp, Calendar, Target, Flag } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';

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
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(15);
  const [weeklyGoalDays, setWeeklyGoalDays] = useState(7);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!user) return;
      
      setLoading(true);
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
          // Extract user's goal settings
          const extractedDailyGoal = data.daily_goal_minutes || 15;
          const extractedWeeklyDays = data.weekly_goal_days || 7;
          
          setDailyGoalMinutes(extractedDailyGoal);
          setWeeklyGoalDays(extractedWeeklyDays);
          setWeeklyGoalMinutes(extractedDailyGoal * extractedWeeklyDays);
        }
      } catch (error) {
        console.error('Error in fetchUserSettings:', error);
      } finally {
        setLoading(false);
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
  
  // Calculate character mastery percentage
  const characterMasteryPercent = Math.min(100, Math.round((learnedCharacters / 92) * 100));
  
  // Determine progress color based on percentage
  const getProgressColorClass = (percent: number) => {
    if (percent >= 90) return 'bg-green-500';
    if (percent >= 60) return 'bg-emerald-500';
    if (percent >= 30) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
            <div className="mt-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Weekly Goal</span>
                        <span className={goalProgress >= 100 ? 'text-green-600 font-medium' : ''}>{goalProgress}%</span>
                      </div>
                      <Progress value={goalProgress} className={`h-2 ${getProgressColorClass(goalProgress)}`} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Goal: {formatStudyTime(weeklyGoalMinutes)} per week</p>
                    <p>Daily target: {dailyGoalMinutes} min × {weeklyGoalDays} days</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
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
            <span className="text-sm text-muted-foreground ml-2">/ 92</span>
            {learnedCharacters > 0 && <TrendingUp className="ml-2 h-4 w-4 text-green-500" />}
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-xs">
              <span>Mastery Progress</span>
              <span className={characterMasteryPercent >= 100 ? 'text-green-600 font-medium' : ''}>
                {characterMasteryPercent}%
              </span>
            </div>
            <Progress 
              value={characterMasteryPercent} 
              className={`h-2 ${getProgressColorClass(characterMasteryPercent)}`} 
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {characterMasteryPercent >= 100 
              ? '✨ Complete mastery of basic kana!' 
              : characterMasteryPercent >= 50
                ? 'Good progress on kana mastery' 
                : 'Focus on learning new characters'}
          </p>
        </CardContent>
      </Card>
      
      <Card className={currentStreak > 0 ? 'border-vermilion/20 bg-vermilion/5' : ''}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
            <Calendar className={`mr-2 h-4 w-4 ${currentStreak > 0 ? 'text-vermilion' : ''}`} />
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
                  index < currentStreak % 7 ? 'bg-vermilion' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {currentStreak > 0
              ? currentStreak > longestStreak 
                ? '🔥 New record! Keep going!' 
                : `Longest streak: ${longestStreak} days`
              : '⚠️ Start your streak by studying today!'}
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-indigo/5 border-indigo/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
            <Target className="mr-2 h-4 w-4 text-indigo" />
            Learning Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" /> Daily Study
                </span>
                <span>{dailyGoalMinutes} minutes</span>
              </div>
              <Progress value={75} className="h-1.5 bg-indigo" />
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" /> Days per Week
                </span>
                <span>{weeklyGoalDays} days</span>
              </div>
              <Progress value={Math.round((currentStreak % 7) / weeklyGoalDays * 100)} className="h-1.5 bg-vermilion" />
            </div>
            
            <div className="pt-1">
              <div className="text-xs flex items-center justify-between">
                <span className="text-muted-foreground flex items-center">
                  <Flag className="h-3 w-3 mr-1" /> Study consistency
                </span>
                <span className={currentStreak > 2 ? 'text-green-600 font-medium' : ''}>
                  {currentStreak > 6 ? 'Excellent' : 
                   currentStreak > 3 ? 'Good' : 
                   currentStreak > 1 ? 'Starting' : 'Needs work'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressStats;
