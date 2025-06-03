import { supabase } from '@/integrations/supabase/client';
import { UserKanaProgress } from '@/types/kana';
import { enhancedCharacterProgressService, PracticeMetrics } from './enhancedCharacterProgressService';

export const characterProgressService = {
  // Legacy method - keep for backwards compatibility
  updateCharacterProgress: async (userId: string, characterId: string, isCorrect: boolean): Promise<boolean> => {
    const metrics: PracticeMetrics = {
      responseTime: 2000, // Default response time for legacy calls
      isCorrect,
      sessionId: 'legacy-session',
      characterId,
      timestamp: new Date()
    };
    
    return enhancedCharacterProgressService.updateCharacterProgressEnhanced(userId, characterId, metrics);
  },

  // Enhanced method with timing
  updateCharacterProgressWithTiming: async (
    userId: string, 
    characterId: string, 
    isCorrect: boolean, 
    responseTime: number,
    sessionId: string = 'quiz-session'
  ): Promise<boolean> => {
    const metrics: PracticeMetrics = {
      responseTime,
      isCorrect,
      sessionId,
      characterId,
      timestamp: new Date()
    };
    
    return enhancedCharacterProgressService.updateCharacterProgressEnhanced(userId, characterId, metrics);
  },

  // Get character progress
  getCharacterProgress: async (userId: string, characterIds?: string[]): Promise<UserKanaProgress[]> => {
    return enhancedCharacterProgressService.getEnhancedCharacterProgress(userId, characterIds);
  },

  // Get user progress
  getUserProgress: async (userId: string): Promise<UserKanaProgress[]> => {
    return enhancedCharacterProgressService.getEnhancedCharacterProgress(userId);
  },

  // Get characters for review using enhanced algorithm
  getCharactersForReview: async (userId: string, limit: number = 20): Promise<UserKanaProgress[]> => {
    try {
      const { data, error } = await supabase
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId)
        .lte('review_due', new Date().toISOString())
        .order('confidence_score', { ascending: true }) // Prioritize low confidence characters
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

  // Calculate overall proficiency using enhanced algorithm
  calculateOverallProficiency: async (userId: string, kanaType: 'hiragana' | 'katakana' | 'all'): Promise<number> => {
    const stats = await enhancedCharacterProgressService.calculateMasteryStats(
      userId, 
      kanaType === 'all' ? undefined : kanaType
    );
    
    return stats.averageConfidence;
  },

  // Update progress (alias for backwards compatibility)
  updateProgress: async (userId: string, characterId: string, isCorrect: boolean): Promise<boolean> => {
    return characterProgressService.updateCharacterProgress(userId, characterId, isCorrect);
  },

  // New methods for enhanced functionality
  selectNextCharacter: enhancedCharacterProgressService.selectNextCharacter,
  calculateMasteryStats: enhancedCharacterProgressService.calculateMasteryStats,
  getEnhancedProgress: enhancedCharacterProgressService.getEnhancedCharacterProgress
};
