
import { supabaseClient } from '@/lib/supabase';
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
      console.log("Starting new kana learning session:", { userId, kanaType, characterCount: characterIds.length });
      
      const { data, error } = await supabaseClient
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
      
      console.log("Created kana learning session with ID:", data.id);
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
      const { data, error } = await supabaseClient
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
  },
  
  /**
   * Record a study session for any learning activity
   * @param userId User ID
   * @param module Module (e.g., 'hiragana', 'katakana', 'quiz')
   * @param topics Topics covered
   * @param durationMinutes Duration in minutes
   * @param score Optional performance score
   */
  recordStudyActivity: async (
    userId: string,
    module: string,
    topics: string[],
    durationMinutes: number,
    score?: number
  ): Promise<boolean> => {
    try {
      console.log("Recording study activity:", { userId, module, topics, durationMinutes, score });
      
      // Use the progressTrackingService to record the study session
      const result = await progressTrackingService.recordStudySession(
        userId,
        module,
        topics,
        durationMinutes,
        score
      );
      
      if (!result) {
        console.error('Failed to record study session');
        return false;
      }
      
      // Also update the learning streak
      await progressTrackingService.updateLearningStreak(userId);
      
      return true;
    } catch (error) {
      console.error('Error recording study activity:', error);
      return false;
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
    console.log("Updating kana character progress:", { userId, characterId, isCorrect });
    
    // Get the current progress
    const { data: currentProgress, error: progressError } = await supabaseClient
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
      const { error: updateError } = await supabaseClient
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
      
      console.log("Updated kana progress:", { 
        proficiency: newProficiency, 
        masteryLevel: newMasteryLevel,
        consecutiveCorrect: newConsecutiveCorrect 
      });
    } else {
      // Create new progress
      newProficiency = isCorrect ? 20 : 10; // Less aggressive initial value
      
      const { error: insertError } = await supabaseClient
        .from('user_kana_progress')
        .insert({
          user_id: userId,
          character_id: characterId,
          proficiency: newProficiency,
          mistake_count: isCorrect ? 0 : 1,
          total_practice_count: 1,
          consecutive_correct: isCorrect ? 1 : 0,
          last_practiced: new Date().toISOString(),
          review_due: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)).toISOString(), // Review in 3 days
          mastery_level: 0
        });
        
      if (insertError) {
        console.error('Error creating user kana progress:', insertError);
        return false;
      }
      
      console.log("Created new kana progress entry:", { characterId, proficiency: newProficiency });
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
    console.log("Completing kana learning session:", { userId, sessionId, results });
    
    // Update the session as completed
    const { error: sessionError } = await supabaseClient
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
    
    // Update the learning streak - CRITICAL: Ensure streak is updated!
    const streakUpdated = await progressTrackingService.updateLearningStreak(userId);
    if (!streakUpdated) {
      console.warn("Failed to update learning streak, attempting again...");
      await progressTrackingService.updateLearningStreak(userId);
    }
    
    // Record this as a study session for broader progress tracking
    const sessionDuration = 10; // Estimate 10 minutes for a kana session
    await kanaLearningService.recordStudyActivity(
      userId,
      results.charactersStudied[0]?.startsWith('hiragana') ? 'hiragana' : 'katakana',
      ['characters', 'recognition'],
      sessionDuration,
      results.accuracy
    );
    
    return true;
  } catch (error) {
    console.error('Error in completeKanaLearningSession:', error);
    return false;
  }
};
