
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Clock, Calendar, Target, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

// Define a type for the user settings to avoid TypeScript errors
interface UserSettingsWithLearningGoals {
  id: string;
  daily_goal_minutes?: number;
  weekly_goal_days?: number;
  // Add other properties that might be part of user_settings
  created_at?: string;
  updated_at?: string;
  // Add any other fields that might be needed
}

const LearningGoalsSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(15);
  const [weeklyGoalDays, setWeeklyGoalDays] = useState(5);
  const [loading, setLoading] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettingsWithLearningGoals | null>(null);
  
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
          console.error('Error fetching user settings:', error);
          return;
        }
        
        if (data) {
          setUserSettings(data as UserSettingsWithLearningGoals);
          // Type assertion to help TypeScript understand the structure
          const typedData = data as UserSettingsWithLearningGoals;
          if (typedData.daily_goal_minutes) {
            setDailyGoalMinutes(typedData.daily_goal_minutes);
          }
          if (typedData.weekly_goal_days) {
            setWeeklyGoalDays(typedData.weekly_goal_days);
          }
        }
      } catch (error) {
        console.error('Error in fetchUserSettings:', error);
      }
    };
    
    fetchUserSettings();
  }, [user]);
  
  const saveSettings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      if (userSettings) {
        // Update existing settings
        const { error } = await supabase
          .from('user_settings')
          .update({
            daily_goal_minutes: dailyGoalMinutes,
            weekly_goal_days: weeklyGoalDays
          } as UserSettingsWithLearningGoals) // Type assertion to help TypeScript
          .eq('id', user.id);
          
        if (error) {
          throw error;
        }
      } else {
        // Insert new settings
        const { error } = await supabase
          .from('user_settings')
          .insert({
            id: user.id,
            daily_goal_minutes: dailyGoalMinutes,
            weekly_goal_days: weeklyGoalDays
          } as UserSettingsWithLearningGoals); // Type assertion to help TypeScript
          
        if (error) {
          throw error;
        }
      }
      
      toast({
        title: "Settings updated",
        description: "Your learning goals have been saved.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error saving settings",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate weekly total minutes
  const totalWeeklyMinutes = dailyGoalMinutes * weeklyGoalDays;
  
  // Helper function to get time commitment level
  const getCommitmentLevel = () => {
    if (totalWeeklyMinutes < 60) return "Light";
    if (totalWeeklyMinutes < 150) return "Moderate";
    if (totalWeeklyMinutes < 300) return "Dedicated";
    return "Intensive";
  };
  
  // Helper function to get commitment color
  const getCommitmentColor = () => {
    if (totalWeeklyMinutes < 60) return "text-blue-500";
    if (totalWeeklyMinutes < 150) return "text-green-500";
    if (totalWeeklyMinutes < 300) return "text-amber-500";
    return "text-vermilion";
  };
  
  // Helper function to format minutes as hours and minutes
  const formatMinutes = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} hour${hours !== 1 ? 's' : ''}${mins > 0 ? ` ${mins} min` : ''}`;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="mr-2 h-5 w-5 text-indigo" />
          Learning Goals
        </CardTitle>
        <CardDescription>
          Set your daily and weekly learning targets to establish a consistent study habit
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-indigo/5 p-4 rounded-lg mb-6">
          <h3 className="text-sm font-medium text-indigo mb-2">Your Weekly Commitment</h3>
          <div className="flex items-end justify-between mb-2">
            <div>
              <span className="text-2xl font-bold">{formatMinutes(totalWeeklyMinutes)}</span>
              <span className="text-xs text-muted-foreground block">per week</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={`text-sm font-medium ${getCommitmentColor()}`}>
                    {getCommitmentLevel()}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {getCommitmentLevel() === "Light" && "Good for beginners. Consider increasing as you progress."}
                    {getCommitmentLevel() === "Moderate" && "Balanced approach for steady progress."}
                    {getCommitmentLevel() === "Dedicated" && "Great commitment for significant progress."}
                    {getCommitmentLevel() === "Intensive" && "Advanced study schedule. Ensure it's sustainable."}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Progress value={(totalWeeklyMinutes / 300) * 100} className="h-1.5" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium flex items-center">
              <Clock className="mr-2 h-4 w-4 text-indigo" />
              Daily Study Goal
            </label>
            <span className="text-sm font-bold text-indigo">{dailyGoalMinutes} minutes</span>
          </div>
          <Slider 
            min={5}
            max={60}
            step={5}
            value={[dailyGoalMinutes]}
            onValueChange={(value) => setDailyGoalMinutes(value[0])}
            className="my-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5 min</span>
            <span>30 min</span>
            <span>60 min</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            <Info className="h-3 w-3 mr-1" />
            Aim to study for at least {dailyGoalMinutes} minutes each day for optimal retention
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-indigo" />
              Weekly Practice Goal
            </label>
            <span className="text-sm font-bold text-indigo">{weeklyGoalDays} days</span>
          </div>
          <Slider 
            min={1}
            max={7}
            step={1}
            value={[weeklyGoalDays]}
            onValueChange={(value) => setWeeklyGoalDays(value[0])}
            className="my-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 day</span>
            <span>4 days</span>
            <span>7 days</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            <Info className="h-3 w-3 mr-1" />
            Consistent practice on {weeklyGoalDays} days each week builds long-term memory
          </p>
        </div>
        
        <Button 
          onClick={saveSettings} 
          className="w-full"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Learning Goals"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default LearningGoalsSettings;
