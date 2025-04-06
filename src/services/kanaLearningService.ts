import { supabase } from '@/integrations/supabase/client';
import { UserKanaProgress } from '@/types/kana';
import { progressTrackingService } from './progressTrackingService';

/**
 * Service for managing kana learning sessions and updating user progress
 */
export const kanaLearningService = {
  /**
   * Start a new kana learning session
   * @param userId User ID
   * @param kanaType 'hiragana' or 'katakana'
   * @param characterIds Array of character IDs to be studied in the session
   * @returns The created session or null if error
   */
  startKanaLearningSession: async (
    userId: string,
    kanaType: string,
    characterIds: string[]
  ): Promise<{ id: string } | null> => {
    try {
      const { data, error } = await supabase
        .from('kana_learning_sessions')
        .insert({
          user_id: userId,
          start_time: new Date().toISOString(),
          kana_type: kanaType,
          characters_studied: characterIds,
          completed: false
        })
        .select('id')
        .single();
        
      if (error) {
        console.error('Error starting kana session:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in startKanaLearningSession:', error);
      return null;
    }
  },

  /**
   * Get a kana learning session by ID
   * @param sessionId Session ID
   * @returns The session or null if not found
   */
  getKanaLearningSession: async (sessionId: string): Promise<{
    id: string,
    user_id: string,
    start_time: string,
    end_time?: string,
    kana_type: string,
    characters_studied: string[],
    accuracy?: number,
    completed: boolean
  } | null> => {
    try {
      const { data, error } = await supabase
        .from('kana_learning_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
        
      if (error) {
        console.error('Error fetching kana session:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getKanaLearningSession:', error);
      return null;
    }
  }
};

/**
 * Update the user's kana character progress
 * @param userId User ID
 * @param characterId Character ID
 * @param isCorrect Whether the character was answered correctly
 */
export const updateKanaCharacterProgress = async (
  userId: string,
  characterId: string,
  isCorrect: boolean
): Promise<boolean> => {
  try {
    // Get the current progress
    const { data: currentProgress, error: progressError } = await supabase
      .from('user_kana_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('character_id', characterId)
      .single();
      
    if (progressError && progressError.code !== 'PGRST116') {
      console.error('Error fetching user kana progress:', progressError);
      return false;
    }
    
    let newProficiency = 0;
    let newMistakeCount = 0;
    let newTotalPracticeCount = 1;
    let newConsecutiveCorrect = isCorrect ? 1 : 0;
    let newMasteryLevel = 0;
    
    if (currentProgress) {
      // Update existing progress
      newProficiency = Math.max(0, Math.min(100, currentProgress.proficiency + (isCorrect ? 5 : -10)));
      newMistakeCount = currentProgress.mistake_count + (isCorrect ? 0 : 1);
      newTotalPracticeCount = currentProgress.total_practice_count + 1;
      newConsecutiveCorrect = isCorrect ? currentProgress.consecutive_correct + 1 : 0;
      newMasteryLevel = currentProgress.mastery_level || 0;
      
      // Mastery level increases with consecutive correct answers
      if (newConsecutiveCorrect >= 5 && newMasteryLevel < 3) {
        newMasteryLevel = Math.min(3, newMasteryLevel + 1);
        newConsecutiveCorrect = 0; // Reset consecutive correct count after leveling up
      }
      
      // Update the progress
      const { error: updateError } = await supabase
        .from('user_kana_progress')
        .update({
          proficiency: newProficiency,
          mistake_count: newMistakeCount,
          total_practice_count: newTotalPracticeCount,
          consecutive_correct: newConsecutiveCorrect,
          last_practiced: new Date().toISOString(),
          review_due: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)).toISOString(), // Review in 7 days
          mastery_level: newMasteryLevel
        })
        .eq('id', currentProgress.id);
        
      if (updateError) {
        console.error('Error updating user kana progress:', updateError);
        return false;
      }
    } else {
      // Create new progress
      newProficiency = isCorrect ? 50 : 20;
      
      const { error: insertError } = await supabase
        .from('user_kana_progress')
        .insert({
          user_id: userId,
          character_id: characterId,
          proficiency: newProficiency,
          mistake_count: newMistakeCount,
          total_practice_count: newTotalPracticeCount,
          consecutive_correct: newConsecutiveCorrect,
          last_practiced: new Date().toISOString(),
          review_due: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)).toISOString(), // Review in 7 days
          mastery_level: newMasteryLevel
        });
        
      if (insertError) {
        console.error('Error creating user kana progress:', insertError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateKanaCharacterProgress:', error);
    return false;
  }
};

/**
 * Complete a kana learning session and update user progress
 */
export const completeKanaLearningSession = async (
  userId: string,
  sessionId: string,
  results: {
    accuracy: number,
    charactersStudied: string[],
    progressUpdates: Array<{ characterId: string, isCorrect: boolean }>
  }
): Promise<boolean> => {
  try {
    // Update the session as completed
    const { error: sessionError } = await supabase
      .from('kana_learning_sessions')
      .update({ 
        completed: true,
        end_time: new Date().toISOString(),
        accuracy: results.accuracy,
        characters_studied: results.charactersStudied
      })
      .eq('id', sessionId)
      .eq('user_id', userId);
      
    if (sessionError) {
      console.error('Error completing kana session:', sessionError);
      return false;
    }
    
    // Update the user's progress for each character
    for (const update of results.progressUpdates) {
      await updateKanaCharacterProgress(userId, update.characterId, update.isCorrect);
    }
    
    // Update the learning streak
    await progressTrackingService.updateLearningStreak(userId);
    
    return true;
  } catch (error) {
    console.error('Error in completeKanaLearningSession:', error);
    return false;
  }
};
