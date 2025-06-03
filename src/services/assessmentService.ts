
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AssessmentAnswers {
  [key: number]: string;
}

export async function submitAssessment(user: User, answers: AssessmentAnswers) {
  console.log('Starting assessment submission...');
  
  // Extract user preferences from answers
  const knowledgeLevel = answers[1] || 'beginner';
  const learningGoal = answers[2] || 'general';
  const dailyGoalMinutes = parseInt(answers[3] || '15');
  const priorKnowledge = answers[4] || 'none';
  
  console.log('Updating profiles table...');
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      display_name: user.user_metadata?.name || 'User',
      learning_level: knowledgeLevel,
      learning_goal: learningGoal,
      daily_goal_minutes: dailyGoalMinutes,
    })
    .eq('id', user.id);
    
  if (profileError) {
    console.error('Profile update error:', profileError);
    throw profileError;
  }
  
  console.log('Updating user_settings table...');
  const { error: settingsError } = await supabase
    .from('user_settings')
    .update({
      display_furigana: true
    })
    .eq('id', user.id);
    
  if (settingsError) {
    console.error('Settings update error:', settingsError);
    throw settingsError;
  }
  
  console.log('Creating kana learning session...');
  const now = new Date();
  const currentDate = now.toISOString();
  
  const { error: sessionError } = await supabase
    .from('kana_learning_sessions')
    .insert({
      user_id: user.id,
      kana_type: 'assessment',
      start_time: currentDate,
      end_time: currentDate,
      completed: true,
      accuracy: 100
    });
    
  if (sessionError) {
    console.error('Kana learning session creation error:', sessionError);
    throw sessionError;
  }
  
  console.log('Assessment completed successfully!');
}
