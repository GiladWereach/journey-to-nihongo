
import { supabase } from '../integrations/supabase/client';
import { Achievement, UserAchievement } from '../types/achievements';

// Function to fetch all available achievements
export const fetchAchievements = async (): Promise<Achievement[]> => {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('category', { ascending: true });
      
    if (error) throw error;
    return data as unknown as Achievement[];
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }
};

// Function to fetch current user's achievements
export const fetchUserAchievements = async (userId: string): Promise<UserAchievement[]> => {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq('user_id', userId);
      
    if (error) throw error;
    
    return data.map(item => ({
      ...item,
      earned_at: item.unlocked_at // Map unlocked_at to earned_at for compatibility
    })) as unknown as UserAchievement[];
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    return [];
  }
};

// Function to update achievement progress
export const updateAchievementProgress = async (
  userId: string,
  achievementId: string,
  progress: number
): Promise<void> => {
  try {
    // Check if user already has this achievement
    const { data: existingData, error: fetchError } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single();
      
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means "no rows returned"
      throw fetchError;
    }
    
    // Get achievement details to check if completed
    const { data: achievementData, error: achievementError } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', achievementId)
      .single();
      
    if (achievementError) throw achievementError;
    
    const achievement = achievementData as unknown as Achievement;
    const isCompleted = progress >= achievement.required_progress;
    
    if (!existingData) {
      // Create new progress record
      await supabase.from('user_achievements').insert({
        user_id: userId,
        achievement_id: achievementId,
        current_progress: progress,
        unlocked_at: isCompleted ? new Date().toISOString() : null
      });
    } else {
      // Update existing progress
      await supabase
        .from('user_achievements')
        .update({
          current_progress: progress,
          unlocked_at: isCompleted && !existingData.unlocked_at ? new Date().toISOString() : existingData.unlocked_at
        })
        .eq('id', existingData.id);
    }
  } catch (error) {
    console.error('Error updating achievement progress:', error);
  }
};

// Function to check and award achievements based on an action
export const checkAndAwardAchievements = async (
  userId: string,
  action: string,
  value: number = 1
): Promise<Achievement[]> => {
  try {
    // Get achievements related to this action
    const { data: actionAchievements, error: fetchError } = await supabase
      .from('achievements')
      .select('*')
      .eq('category', action);
      
    if (fetchError) throw fetchError;
    
    const newlyCompletedAchievements: Achievement[] = [];
    
    for (const achievement of actionAchievements) {
      await updateAchievementProgress(userId, achievement.id, value);
      
      // Check if newly completed
      const { data: userAchievement, error: userAchievementError } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .eq('achievement_id', achievement.id)
        .single();
        
      if (userAchievementError) continue;
      
      if (userAchievement.current_progress >= achievement.required_progress && 
          userAchievement.unlocked_at && 
          new Date(userAchievement.unlocked_at).toDateString() === new Date().toDateString()) {
        newlyCompletedAchievements.push(achievement as unknown as Achievement);
      }
    }
    
    return newlyCompletedAchievements;
  } catch (error) {
    console.error('Error checking achievements:', error);
    return [];
  }
};

// Export all functions as a service object
export const achievementService = {
  getAllAchievements: fetchAchievements,
  getUserAchievements: fetchUserAchievements,
  updateProgress: updateAchievementProgress,
  checkAndAward: checkAndAwardAchievements
};
