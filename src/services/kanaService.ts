
import { supabaseClient } from '@/lib/supabase';
import { KanaCharacter, UserKanaProgress, KanaType } from '@/types/kana';
import { hiraganaCharacters } from '@/data/hiraganaCharacterData';
import { katakanaCharacters } from '@/data/katakanaCharacterData';
import { kanaProgressService } from './kanaProgressService';

export const kanaService = {
  /**
   * Get all kana characters
   * @returns Array of KanaCharacter objects
   */
  getAllKana: (): KanaCharacter[] => {
    return [...hiraganaCharacters, ...katakanaCharacters];
  },

  /**
   * Get kana characters by type
   * @param type Type of kana ('hiragana' or 'katakana')
   * @returns Array of KanaCharacter objects
   */
  getKanaByType: (type: 'hiragana' | 'katakana'): KanaCharacter[] => {
    return type === 'hiragana' ? hiraganaCharacters : katakanaCharacters;
  },
  
  /**
   * Get user's kana progress from Supabase
   * @param userId User ID
   * @param type Type of kana ('hiragana', 'katakana', or 'all')
   * @returns Array of UserKanaProgress objects
   */
  getUserKanaProgress: async (userId: string, type: KanaType | 'all' = 'all'): Promise<UserKanaProgress[]> => {
    try {
      let query = supabaseClient
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId);
        
      if (type !== 'all') {
        const kanaType = type === 'hiragana' ? 'hiragana' : 'katakana';
        query = query.like('character_id', `${kanaType}:%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Convert last_practiced and review_due to Date objects
      const progressWithDates = data.map(item => ({
        ...item,
        last_practiced: new Date(item.last_practiced),
        review_due: new Date(item.review_due)
      })) as UserKanaProgress[];
      
      return progressWithDates;
    } catch (error) {
      console.error('Error fetching user kana progress:', error);
      return [];
    }
  },

  /**
   * Calculate proficiency based on user progress
   * @param progress UserKanaProgress object
   * @returns Proficiency score (0-100)
   */
  calculateProficiency: kanaProgressService.calculateProficiency,

  /**
   * Calculate overall proficiency for a collection of kana
   * @param userId User ID
   * @param type Type of kana ('hiragana', 'katakana', or 'all')
   * @returns Average proficiency (0-100)
   */
  calculateOverallProficiency: async (userId: string, type: KanaType | 'all' = 'all') => {
    try {
      // Get user progress first
      const progressEntries = await kanaService.getUserKanaProgress(userId, type);
      
      if (!progressEntries || progressEntries.length === 0) return 0;
      
      // Calculate total proficiency
      const totalProficiency = progressEntries.reduce((sum, entry) => 
        sum + kanaService.calculateProficiency(entry), 0);
      
      return Math.round(totalProficiency / progressEntries.length);
    } catch (error) {
      console.error('Error calculating overall proficiency:', error);
      return 0;
    }
  },

  /**
   * Update user's kana progress in Supabase
   * @param userId User ID
   * @param characterId Kana character ID
   * @param correct Whether the practice was correct or not
   * @returns Promise resolving to success status
   */
  updateProgressFromResults: kanaProgressService.updateProgressFromResults
};
