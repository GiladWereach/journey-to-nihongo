
import { supabaseClient } from '@/lib/supabase';
import { UserKanaProgress } from '@/types/kana';
import { calculateNextReviewDate } from '@/lib/utils';

export const kanaProgressService = {
  /**
   * Calculate proficiency based on user progress
   * @param progress UserKanaProgress object
   * @returns Proficiency score (0-100)
   */
  calculateProficiency: (progress: UserKanaProgress): number => {
    // Base proficiency on total practice and correct answers
    let proficiency = Math.min(100, (progress.total_practice_count - progress.mistake_count) / progress.total_practice_count * 100);
    
    // Adjustments based on consecutive correct answers
    if (progress.consecutive_correct > 5) {
      proficiency += 10;
    } else if (progress.consecutive_correct < 2) {
      proficiency -= 5;
    }
    
    return Math.max(0, Math.min(100, Math.round(proficiency)));
  },

  /**
   * Update user's kana progress in Supabase
   * @param userId User ID
   * @param characterId Kana character ID
   * @param correct Whether the practice was correct or not
   * @returns Promise resolving to success status
   */
  updateProgressFromResults: async (userId: string, characterId: string, correct: boolean): Promise<boolean> => {
    try {
      // Fetch existing progress
      const { data: existingProgress, error: selectError } = await supabaseClient
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('character_id', characterId)
        .single();
        
      if (selectError && selectError.code !== 'PGRST116') {
        console.error('Error fetching existing progress:', selectError);
        return false;
      }
      
      let newProficiency = 0;
      let newMistakeCount = 0;
      let newTotalPracticeCount = 1;
      let newConsecutiveCorrect = correct ? 1 : 0;
      let newMasteryLevel = 0;
      let lastPracticed = new Date();
      let reviewDue = calculateNextReviewDate(newProficiency, newMasteryLevel);
      
      if (existingProgress) {
        // Update existing progress
        newProficiency = kanaProgressService.calculateProficiency({
          ...existingProgress,
          total_practice_count: existingProgress.total_practice_count + 1,
          mistake_count: existingProgress.mistake_count + (correct ? 0 : 1),
          consecutive_correct: correct ? existingProgress.consecutive_correct + 1 : 0
        });
        
        newMistakeCount = existingProgress.mistake_count + (correct ? 0 : 1);
        newTotalPracticeCount = existingProgress.total_practice_count + 1;
        newConsecutiveCorrect = correct ? existingProgress.consecutive_correct + 1 : 0;
        newMasteryLevel = existingProgress.mastery_level || 0;
        lastPracticed = new Date();
        
        // Mastery level updates
        if (newConsecutiveCorrect >= 5 && newMasteryLevel < 3) {
          newMasteryLevel = Math.min(3, newMasteryLevel + 1);
        }
        
        reviewDue = calculateNextReviewDate(newProficiency, newMasteryLevel);
        
        const { error: updateError } = await supabaseClient
          .from('user_kana_progress')
          .update({
            proficiency: newProficiency,
            mistake_count: newMistakeCount,
            total_practice_count: newTotalPracticeCount,
            consecutive_correct: newConsecutiveCorrect,
            mastery_level: newMasteryLevel,
            last_practiced: lastPracticed.toISOString(),
            review_due: reviewDue.toISOString()
          })
          .eq('id', existingProgress.id);
          
        if (updateError) {
          console.error('Error updating progress:', updateError);
          return false;
        }
      } else {
        // Insert new progress
        const { error: insertError } = await supabaseClient
          .from('user_kana_progress')
          .insert({
            user_id: userId,
            character_id: characterId,
            proficiency: 0,
            mistake_count: 0,
            total_practice_count: 1,
            consecutive_correct: correct ? 1 : 0,
            mastery_level: 0,
            last_practiced: lastPracticed.toISOString(),
            review_due: reviewDue.toISOString()
          });
          
        if (insertError) {
          console.error('Error creating progress:', insertError);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error updating kana progress:', error);
      return false;
    }
  }
};
