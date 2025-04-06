
import { supabaseClient } from '@/lib/supabase';
import { UserKanaProgress, KanaCharacter } from '@/types/kana';
import { kanaService } from './kanaService';

export const kanaProgressService = {
  // Get user's progress for all kana
  getUserProgressAll: async (userId: string): Promise<Map<string, UserKanaProgress>> => {
    try {
      const progressData = await kanaService.getUserKanaProgress(userId);
      
      // Create a map for easy lookup
      const progressMap = new Map<string, UserKanaProgress>();
      progressData.forEach(progress => {
        progressMap.set(progress.character_id, progress);
      });
      
      return progressMap;
    } catch (error) {
      console.error('Error fetching all user progress:', error);
      return new Map();
    }
  },

  // Get user's progress sorted by review date
  getReviewQueue: async (userId: string): Promise<{character: KanaCharacter, progress: UserKanaProgress}[]> => {
    try {
      const { data, error } = await supabaseClient
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId)
        .order('review_due', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      // Get all kana characters
      const allKana = kanaService.getAllKana();
      const kanaMap = new Map<string, KanaCharacter>();
      allKana.forEach(kana => {
        kanaMap.set(kana.id, kana);
      });
      
      // Map progress to characters
      const reviewQueue = data
        .map((progress: any) => {
          const character = kanaMap.get(progress.character_id);
          if (!character) return null;
          
          return {
            character,
            progress: {
              ...progress,
              last_practiced: new Date(progress.last_practiced),
              review_due: new Date(progress.review_due)
            } as UserKanaProgress
          };
        })
        .filter(item => item !== null);
      
      return reviewQueue;
    } catch (error) {
      console.error('Error fetching review queue:', error);
      return [];
    }
  },

  // Get proficiency statistics by kana type
  getKanaProficiencyStats: async (userId: string, type: 'hiragana' | 'katakana' | 'all'): Promise<{
    learned: number,
    total: number,
    avgProficiency: number
  }> => {
    try {
      const progressMap = await kanaProgressService.getUserProgressAll(userId);
      const allKana = type === 'all' 
        ? kanaService.getAllKana()
        : kanaService.getKanaByType(type as 'hiragana' | 'katakana');
      
      let learnedCount = 0;
      let totalProficiency = 0;
      
      allKana.forEach(kana => {
        const progress = progressMap.get(kana.id);
        if (progress && progress.proficiency > 0) {
          learnedCount++;
          totalProficiency += progress.proficiency;
        }
      });
      
      return {
        learned: learnedCount,
        total: allKana.length,
        avgProficiency: learnedCount > 0 ? totalProficiency / learnedCount : 0
      };
    } catch (error) {
      console.error('Error calculating proficiency stats:', error);
      return {
        learned: 0,
        total: 0,
        avgProficiency: 0
      };
    }
  }
};
