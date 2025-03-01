
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
  }
};
