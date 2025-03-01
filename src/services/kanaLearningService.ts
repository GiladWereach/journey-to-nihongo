
import { supabaseClient } from '@/lib/supabase';
import { KanaLearningSession, PracticeResult, KanaPracticeResult } from '@/types/kana';

export const kanaLearningService = {
  // Create a new learning session
  createSession: async (userId: string, kanaType: string): Promise<KanaLearningSession | null> => {
    try {
      const { data, error } = await supabaseClient
        .from('kana_learning_sessions')
        .insert({
          user_id: userId,
          kana_type: kanaType,
          characters_studied: [],
          completed: false
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating kana learning session:', error);
        return null;
      }
      
      return data as KanaLearningSession;
    } catch (error) {
      console.error('Error in createSession:', error);
      return null;
    }
  },

  // Complete a learning session
  completeSession: async (
    sessionId: string, 
    charactersStudied: string[], 
    accuracy: number
  ): Promise<boolean> => {
    try {
      const { error } = await supabaseClient
        .from('kana_learning_sessions')
        .update({
          end_time: new Date().toISOString(),
          characters_studied: charactersStudied,
          accuracy: accuracy,
          completed: true
        })
        .eq('id', sessionId);
      
      if (error) {
        console.error('Error completing kana learning session:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in completeSession:', error);
      return false;
    }
  },

  // Update user kana progress
  updateUserProgress: async (
    userId: string,
    characterId: string,
    isCorrect: boolean
  ): Promise<boolean> => {
    try {
      // Check if a record already exists
      const { data: existingData, error: fetchError } = await supabaseClient
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('character_id', characterId)
        .maybeSingle();
      
      if (fetchError) {
        console.error('Error fetching existing progress:', fetchError);
        return false;
      }
      
      const now = new Date();
      // Calculate next review date based on spaced repetition algorithm
      // This is a simple implementation that can be enhanced later
      const reviewDueDate = new Date();
      
      if (existingData) {
        // Update existing record
        const proficiencyChange = isCorrect ? 1 : -1;
        let newProficiency = Math.max(0, existingData.proficiency + proficiencyChange);
        newProficiency = Math.min(5, newProficiency); // Cap at 5
        
        // Spaced repetition logic
        if (isCorrect) {
          // If correct, increase interval based on proficiency
          reviewDueDate.setDate(now.getDate() + Math.pow(2, newProficiency));
        } else {
          // If incorrect, review again soon
          reviewDueDate.setDate(now.getDate() + 1);
        }
        
        const { error: updateError } = await supabaseClient
          .from('user_kana_progress')
          .update({
            proficiency: newProficiency,
            last_practiced: now.toISOString(),
            review_due: reviewDueDate.toISOString(),
            mistake_count: isCorrect ? existingData.mistake_count : existingData.mistake_count + 1,
            total_practice_count: existingData.total_practice_count + 1
          })
          .eq('id', existingData.id);
        
        if (updateError) {
          console.error('Error updating progress:', updateError);
          return false;
        }
      } else {
        // Create new record
        const initialProficiency = isCorrect ? 1 : 0;
        
        // Set initial review date
        if (isCorrect) {
          reviewDueDate.setDate(now.getDate() + 1); // Review tomorrow if correct
        } else {
          reviewDueDate.setHours(now.getHours() + 4); // Review in 4 hours if incorrect
        }
        
        const { error: insertError } = await supabaseClient
          .from('user_kana_progress')
          .insert({
            user_id: userId,
            character_id: characterId,
            proficiency: initialProficiency,
            last_practiced: now.toISOString(),
            review_due: reviewDueDate.toISOString(),
            mistake_count: isCorrect ? 0 : 1,
            total_practice_count: 1
          });
        
        if (insertError) {
          console.error('Error creating progress:', insertError);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateUserProgress:', error);
      return false;
    }
  },

  // Get user's learning sessions
  getUserSessions: async (userId: string): Promise<KanaLearningSession[]> => {
    try {
      const { data, error } = await supabaseClient
        .from('kana_learning_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return data as KanaLearningSession[];
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      return [];
    }
  },

  // Process practice results and update user progress
  processPracticeResults: async (
    userId: string,
    sessionId: string,
    results: PracticeResult
  ): Promise<boolean> => {
    try {
      // Update character-specific progress
      const progressPromises = results.characterResults.map(result => 
        kanaLearningService.updateUserProgress(
          userId,
          result.character,
          result.correct
        )
      );
      
      await Promise.all(progressPromises);
      
      // Complete the session
      return await kanaLearningService.completeSession(
        sessionId,
        results.characterResults.map(r => r.character),
        Math.round(results.accuracy * 100)
      );
    } catch (error) {
      console.error('Error processing practice results:', error);
      return false;
    }
  }
};
