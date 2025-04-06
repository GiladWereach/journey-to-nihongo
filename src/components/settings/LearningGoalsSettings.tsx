
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const LearningGoalsSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(15);
  const [weeklyGoalDays, setWeeklyGoalDays] = useState(5);
  const [loading, setLoading] = useState(false);
  const [userSettings, setUserSettings] = useState<any>(null);
  
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
          setUserSettings(data);
          if (data.daily_goal_minutes) {
            setDailyGoalMinutes(data.daily_goal_minutes);
          }
          if (data.weekly_goal_days) {
            setWeeklyGoalDays(data.weekly_goal_days);
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
          })
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
          });
          
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Daily Study Goal: {dailyGoalMinutes} minutes
          </label>
          <Slider 
            min={5}
            max={60}
            step={5}
            value={[dailyGoalMinutes]}
            onValueChange={(value) => setDailyGoalMinutes(value[0])}
          />
          <p className="text-xs text-muted-foreground">
            Aim to study for at least {dailyGoalMinutes} minutes each day
          </p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Weekly Practice Goal: {weeklyGoalDays} days per week
          </label>
          <Slider 
            min={1}
            max={7}
            step={1}
            value={[weeklyGoalDays]}
            onValueChange={(value) => setWeeklyGoalDays(value[0])}
          />
          <p className="text-xs text-muted-foreground">
            Try to practice on at least {weeklyGoalDays} days each week
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
