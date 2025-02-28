
import { supabase } from '@/integrations/supabase/client';
import { Achievement, UserAchievement } from '@/types/achievements';

/**
 * Service for managing user achievements
 */
export const achievementService = {
  /**
   * Get all achievements
   */
  async getAllAchievements(): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('category', { ascending: true });
      
    if (error) throw error;
    return data || [];
  },
  
  /**
   * Get user's earned achievements
   */
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*, achievement:achievements(*)')
      .eq('user_id', userId);
      
    if (error) throw error;
    return data || [];
  },
  
  /**
   * Award an achievement to a user
   */
  async awardAchievement(userId: string, achievementId: string): Promise<void> {
    // Check if user already has this achievement
    const { data: existingAchievement } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single();
      
    // If not, award it
    if (!existingAchievement) {
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_id: achievementId
        });
        
      if (error) throw error;
    }
  },
  
  /**
   * Check and award achievement if conditions are met
   */
  async checkAndAwardAchievement(
    userId: string, 
    achievementName: string, 
    conditionMet: boolean
  ): Promise<{ awarded: boolean; achievement: Achievement | null }> {
    if (!conditionMet) {
      return { awarded: false, achievement: null };
    }
    
    try {
      // Get the achievement by title
      const { data: achievement, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('title', achievementName)
        .single();
        
      if (error || !achievement) {
        return { awarded: false, achievement: null };
      }
      
      // Check if user already has this achievement
      const { data: existingAchievement } = await supabase
        .from('user_achievements')
        .select('id')
        .eq('user_id', userId)
        .eq('achievement_id', achievement.id)
        .single();
        
      // If already awarded, return false
      if (existingAchievement) {
        return { awarded: false, achievement };
      }
      
      // Award the achievement
      await this.awardAchievement(userId, achievement.id);
      
      return { awarded: true, achievement };
    } catch (error) {
      console.error('Error checking achievement:', error);
      return { awarded: false, achievement: null };
    }
  }
};
