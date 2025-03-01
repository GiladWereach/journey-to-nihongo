import { supabaseClient } from '@/lib/supabase';
import { KanaCharacter, KanaType, UserKanaProgress, KanaPracticeResult } from '@/types/kana';
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
  
  // Add or update user progress for a specific character
  updateKanaProgress: async (
    userId: string, 
    characterId: string, 
    isCorrect: boolean
  ): Promise<void> => {
    try {
      // First check if we already have a record for this user and character
      const { data, error } = await supabaseClient
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('character_id', characterId)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching kana progress:', error);
        throw error;
      }
      
      const now = new Date().toISOString();
      
      // If we already have a record, update it
      if (data) {
        // Calculate new proficiency based on current value and whether the answer was correct
        // Correct answers increase proficiency, incorrect answers decrease it
        const currentProficiency = data.proficiency || 0;
        
        // Adjust proficiency - correct answers give bigger boost for beginners,
        // wrong answers have a smaller impact for more advanced users
        let proficiencyChange = 0;
        if (isCorrect) {
          // At lower proficiency levels, give bigger boosts (up to +15)
          proficiencyChange = Math.max(15 - Math.floor(currentProficiency / 10), 5);
        } else {
          // At higher proficiency levels, smaller penalties (down to -3)
          proficiencyChange = Math.min(-3 - Math.floor((100 - currentProficiency) / 10), -10);
        }
        
        // Calculate new proficiency, keeping it within 0-100 range
        const newProficiency = Math.min(Math.max(currentProficiency + proficiencyChange, 0), 100);
        
        // Set review due date based on proficiency level
        let reviewDueDate = new Date();
        if (newProficiency < 30) {
          // Beginner: review in a few hours
          reviewDueDate.setHours(reviewDueDate.getHours() + 4);
        } else if (newProficiency < 70) {
          // Intermediate: review in a day
          reviewDueDate.setDate(reviewDueDate.getDate() + 1);
        } else {
          // Advanced: review in a few days
          reviewDueDate.setDate(reviewDueDate.getDate() + 3);
        }
        
        const { error: updateError } = await supabaseClient
          .from('user_kana_progress')
          .update({
            proficiency: newProficiency,
            total_practice_count: data.total_practice_count + 1,
            mistake_count: isCorrect ? data.mistake_count : data.mistake_count + 1,
            last_practiced: now,
            review_due: reviewDueDate.toISOString(),
            updated_at: now
          })
          .eq('id', data.id);
          
        if (updateError) {
          console.error('Error updating kana progress:', updateError);
          throw updateError;
        }
      } else {
        // Create a new record with initial values
        const initialProficiency = isCorrect ? 15 : 5;
        
        // Set initial review due date
        let reviewDueDate = new Date();
        reviewDueDate.setHours(reviewDueDate.getHours() + 4); // Start with a 4-hour review period
        
        const { error: insertError } = await supabaseClient
          .from('user_kana_progress')
          .insert({
            user_id: userId,
            character_id: characterId,
            proficiency: initialProficiency,
            total_practice_count: 1,
            mistake_count: isCorrect ? 0 : 1,
            last_practiced: now,
            review_due: reviewDueDate.toISOString()
          });
          
        if (insertError) {
          console.error('Error inserting kana progress:', insertError);
          throw insertError;
        }
      }
    } catch (error) {
      console.error('Error updating kana progress:', error);
    }
  },
  
  // Update progress for multiple characters from practice results
  updateProgressFromResults: async (
    userId: string, 
    results: KanaPracticeResult[]
  ): Promise<void> => {
    if (!userId || !results || results.length === 0) return;
    
    try {
      // Process each result sequentially to ensure accurate updates
      for (const result of results) {
        await kanaService.updateKanaProgress(
          userId,
          result.characterId,
          result.correct
        );
      }
      console.log(`Updated progress for ${results.length} characters`);
    } catch (error) {
      console.error('Error updating progress from results:', error);
    }
  },
  
  // Calculate overall proficiency for a kana type
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
  },
  
  // Get kana character by ID
  getKanaById: (id: string): KanaCharacter | undefined => {
    return [...hiraganaCharacters, ...katakanaCharacters].find(kana => kana.id === id);
  },
  
  // Get progress for a specific character
  getCharacterProgress: (
    userProgress: UserKanaProgress[], 
    characterId: string
  ): UserKanaProgress | undefined => {
    return userProgress.find(progress => progress.character_id === characterId);
  },
  
  // Get characters that need review based on their review due dates
  getCharactersForReview: (
    userProgress: UserKanaProgress[], 
    kanaType: KanaType | 'all' = 'all',
    limit: number = 10
  ): string[] => {
    const now = new Date();
    
    // Filter progress entries where review is due
    const dueForReview = userProgress
      .filter(progress => {
        // Check if this character is of the requested type
        if (kanaType !== 'all' && !progress.character_id.startsWith(kanaType)) {
          return false;
        }
        
        // Check if review is due
        return progress.review_due <= now;
      })
      // Sort by review due date (oldest first)
      .sort((a, b) => a.review_due.getTime() - b.review_due.getTime())
      // Get only the character IDs
      .map(progress => progress.character_id);
    
    return dueForReview.slice(0, limit);
  }
};
