
import { supabase } from '@/integrations/supabase/client';

export interface CharacterProgress {
  id: string;
  user_id: string;
  character_id: string;
  proficiency: number;
  mistake_count: number;
  total_practice_count: number;
  consecutive_correct: number;
  last_practiced: string;
  review_due: string;
  mastery_level: number;
}

export const characterProgressService = {
  // Update character progress when user answers
  updateCharacterProgress: async (
    userId: string, 
    characterId: string, 
    isCorrect: boolean
  ): Promise<boolean> => {
    try {
      // Get existing progress or create new
      const { data: existing, error: fetchError } = await supabase
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('character_id', characterId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      const now = new Date().toISOString();
      const reviewDue = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours from now

      if (existing) {
        // Update existing progress
        const newConsecutiveCorrect = isCorrect ? existing.consecutive_correct + 1 : 0;
        const newProficiency = Math.min(100, Math.max(0, 
          existing.proficiency + (isCorrect ? 5 : -3)
        ));

        const { error: updateError } = await supabase
          .from('user_kana_progress')
          .update({
            proficiency: newProficiency,
            mistake_count: existing.mistake_count + (isCorrect ? 0 : 1),
            total_practice_count: existing.total_practice_count + 1,
            consecutive_correct: newConsecutiveCorrect,
            last_practiced: now,
            review_due: reviewDue,
            mastery_level: Math.floor(newConsecutiveCorrect / 5) // Level up every 5 consecutive correct
          })
          .eq('id', existing.id);

        if (updateError) throw updateError;
      } else {
        // Create new progress entry
        const { error: insertError } = await supabase
          .from('user_kana_progress')
          .insert([{
            user_id: userId,
            character_id: characterId,
            proficiency: isCorrect ? 5 : 0,
            mistake_count: isCorrect ? 0 : 1,
            total_practice_count: 1,
            consecutive_correct: isCorrect ? 1 : 0,
            last_practiced: now,
            review_due: reviewDue,
            mastery_level: 0
          }]);

        if (insertError) throw insertError;
      }

      return true;
    } catch (error) {
      console.error('Error updating character progress:', error);
      return false;
    }
  },

  // Get user's progress for specific characters
  getCharacterProgress: async (userId: string, characterIds?: string[]): Promise<CharacterProgress[]> => {
    try {
      let query = supabase
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId);

      if (characterIds) {
        query = query.in('character_id', characterIds);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data as CharacterProgress[] || [];
    } catch (error) {
      console.error('Error fetching character progress:', error);
      return [];
    }
  },

  // Get characters that need review
  getCharactersForReview: async (userId: string, limit: number = 10): Promise<CharacterProgress[]> => {
    try {
      const { data, error } = await supabase
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId)
        .lte('review_due', new Date().toISOString())
        .order('review_due', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return data as CharacterProgress[] || [];
    } catch (error) {
      console.error('Error fetching characters for review:', error);
      return [];
    }
  }
};
