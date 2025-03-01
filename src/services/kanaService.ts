
import { supabaseClient } from '@/lib/supabase';
import { KanaCharacter, KanaType, UserKanaProgress } from '@/types/kana';
import { hiraganaCharacters } from '@/data/hiraganaData';
import { katakanaCharacters } from '@/data/katakanaData';

// Create and export the kanaService
export const kanaService = {
  getAllKana: (): KanaCharacter[] => {
    // Return all kana characters (both hiragana and katakana)
    return [...hiraganaCharacters, ...katakanaCharacters];
  },
  
  getKanaByType: (type: KanaType): KanaCharacter[] => {
    // Return kana filtered by type
    return type === 'hiragana' 
      ? hiraganaCharacters 
      : katakanaCharacters;
  },
  
  // Get characters by specific row/group
  getKanaByRow: (type: KanaType, row: string): KanaCharacter[] => {
    const allKana = type === 'hiragana' ? hiraganaCharacters : katakanaCharacters;
    
    // Filter by the row identifier in the id field
    return allKana.filter(kana => kana.id.includes(`${type}-${row}`));
  },
  
  // Get specific dakuten/handakuten character groups
  getDakutenKana: (type: KanaType): KanaCharacter[] => {
    const allKana = type === 'hiragana' ? hiraganaCharacters : katakanaCharacters;
    
    // These are the characters with dakuten (voiced) marks
    const dakutenRows = ['g', 'z', 'd', 'b', 'p', 'v', 'j'];
    
    return allKana.filter(kana => {
      const id = kana.id.toLowerCase();
      return dakutenRows.some(row => id.includes(`-${row}`));
    });
  },
  
  getUserKanaProgress: async (userId: string): Promise<UserKanaProgress[]> => {
    try {
      const { data, error } = await supabaseClient
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId);
        
      if (error) {
        console.error('Error fetching user progress:', error);
        throw error;
      }
      
      return data.map((progress: any) => ({
        id: progress.id,
        user_id: progress.user_id,
        character_id: progress.character_id,
        proficiency: progress.proficiency,
        mistake_count: progress.mistake_count,
        total_practice_count: progress.total_practice_count,
        last_practiced: new Date(progress.last_practiced),
        review_due: new Date(progress.review_due)
      }));
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return [];
    }
  },
  
  // Add new method to calculate overall proficiency for a kana type
  calculateOverallProficiency: async (userId: string, kanaType: KanaType | 'all'): Promise<number> => {
    try {
      const userProgress = await kanaService.getUserKanaProgress(userId);
      if (!userProgress || userProgress.length === 0) return 0;
      
      // Get all kana characters of the specified type
      const targetKana = kanaType === 'all' 
        ? kanaService.getAllKana() 
        : kanaService.getKanaByType(kanaType);
      
      // Map character IDs for easier lookup
      const kanaIds = targetKana.map(kana => kana.id);
      
      // Filter progress entries for the targeted kana type
      const relevantProgress = userProgress.filter(
        progress => kanaType === 'all' || progress.character_id.startsWith(kanaType)
      );
      
      // Calculate total proficiency
      let totalProficiency = 0;
      
      // First, count progress entries for characters that have been practiced
      const practicedCharactersMap = new Map();
      relevantProgress.forEach(progress => {
        practicedCharactersMap.set(progress.character_id, progress.proficiency);
        totalProficiency += progress.proficiency;
      });
      
      // Account for characters with no progress
      const unpracticedCharacterCount = kanaIds.length - practicedCharactersMap.size;
      
      // Calculate average proficiency (including unpracticed characters as 0%)
      const overallProficiency = totalProficiency / (kanaIds.length || 1);
      
      return Math.min(Math.round(overallProficiency), 100);
    } catch (error) {
      console.error('Error calculating overall proficiency:', error);
      return 0;
    }
  }
};
