
import { supabase } from '@/integrations/supabase/client';
import { UserKanaProgress } from '@/types/kana';

export const characterProgressService = {
  // Update character progress
  updateCharacterProgress: async (userId: string, characterId: string, isCorrect: boolean): Promise<boolean> => {
    try {
      const { data: existing, error: fetchError } = await supabase
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('character_id', characterId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      const now = new Date().toISOString();

      if (existing) {
        const proficiencyChange = isCorrect ? 10 : -5;
        const newProficiency = Math.min(Math.max((existing.proficiency || 0) + proficiencyChange, 0), 100);

        const { error: updateError } = await supabase
          .from('user_kana_progress')
          .update({
            proficiency: newProficiency,
            total_practice_count: (existing.total_practice_count || 0) + 1,
            mistake_count: existing.mistake_count + (isCorrect ? 0 : 1),
            consecutive_correct: isCorrect ? (existing.consecutive_correct || 0) + 1 : 0,
            last_practiced: now,
            updated_at: now
          })
          .eq('id', existing.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('user_kana_progress')
          .insert({
            user_id: userId,
            character_id: characterId,
            proficiency: isCorrect ? 15 : 5,
            total_practice_count: 1,
            mistake_count: isCorrect ? 0 : 1,
            consecutive_correct: isCorrect ? 1 : 0,
            last_practiced: now
          });

        if (insertError) throw insertError;
      }

      return true;
    } catch (error) {
      console.error('Error updating character progress:', error);
      return false;
    }
  },

  // Get user progress for specific characters
  getCharacterProgress: async (userId: string, characterIds?: string[]): Promise<UserKanaProgress[]> => {
    try {
      let query = supabase
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId);

      if (characterIds && characterIds.length > 0) {
        query = query.in('character_id', characterIds);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        character_id: item.character_id,
        proficiency: item.proficiency,
        mistake_count: item.mistake_count,
        total_practice_count: item.total_practice_count,
        consecutive_correct: item.consecutive_correct,
        mastery_level: item.mastery_level,
        last_practiced: new Date(item.last_practiced),
        review_due: new Date(item.review_due),
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
    } catch (error) {
      console.error('Error fetching character progress:', error);
      return [];
    }
  },

  // Get all user progress
  getUserProgress: async (userId: string): Promise<UserKanaProgress[]> => {
    return characterProgressService.getCharacterProgress(userId);
  },

  // Get characters due for review
  getCharactersForReview: async (userId: string, limit: number = 20): Promise<UserKanaProgress[]> => {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId)
        .lte('review_due', now)
        .order('review_due', { ascending: true })
        .limit(limit);

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        character_id: item.character_id,
        proficiency: item.proficiency,
        mistake_count: item.mistake_count,
        total_practice_count: item.total_practice_count,
        consecutive_correct: item.consecutive_correct,
        mastery_level: item.mastery_level,
        last_practiced: new Date(item.last_practiced),
        review_due: new Date(item.review_due),
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
    } catch (error) {
      console.error('Error fetching characters for review:', error);
      return [];
    }
  },

  // Calculate overall proficiency for a kana type
  calculateOverallProficiency: async (userId: string, kanaType: 'hiragana' | 'katakana' | 'all'): Promise<number> => {
    try {
      let query = supabase
        .from('user_kana_progress')
        .select('proficiency')
        .eq('user_id', userId);

      if (kanaType !== 'all') {
        query = query.ilike('character_id', `${kanaType}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (!data || data.length === 0) return 0;

      const totalProficiency = data.reduce((sum, item) => sum + (item.proficiency || 0), 0);
      return Math.round(totalProficiency / data.length);
    } catch (error) {
      console.error('Error calculating overall proficiency:', error);
      return 0;
    }
  },

  // Update progress (alias for updateCharacterProgress)
  updateProgress: async (userId: string, characterId: string, isCorrect: boolean): Promise<boolean> => {
    return characterProgressService.updateCharacterProgress(userId, characterId, isCorrect);
  }
};
