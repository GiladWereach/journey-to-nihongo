import { supabaseClient } from '@/lib/supabase';
import { KanaCharacter, KanaType, UserKanaProgress, KanaPracticeResult } from '@/types/kana';
import { hiraganaCharacters } from '@/data/hiraganaData';
import { katakanaCharacters } from '@/data/katakanaData';
import { calculateNextReviewDate } from '@/lib/utils';

// Constants for spaced repetition
const CONSECUTIVE_THRESHOLD = 8; // How many consecutive correct answers needed for mastery
const INITIAL_INTERVAL_DAYS = 3; // Initial disappearance period in days
const INTERVAL_MULTIPLIER = 1.5; // How much to multiply the interval for each level

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
        consecutive_correct: progress.consecutive_correct || 0,
        mastery_level: progress.mastery_level || 0,
        last_practiced: new Date(progress.last_practiced),
        review_due: new Date(progress.review_due)
      })) as UserKanaProgress[];
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return [];
    }
  },
  
  // Add or update user progress for a specific character with spaced repetition system
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
        // Get current values or defaults
        const currentProficiency = data.proficiency || 0;
        const currentConsecutiveCorrect = data.consecutive_correct || 0;
        const currentMasteryLevel = data.mastery_level || 0;
        
        // Update consecutive correct answers
        let newConsecutiveCorrect = isCorrect ? 
          currentConsecutiveCorrect + 1 : 0; // Reset on mistake
        
        // Check if character is due for review
        const isDueForReview = new Date(data.review_due) <= new Date();
        
        // Determine new mastery level
        let newMasteryLevel = currentMasteryLevel;
        let newReviewDue = new Date(data.review_due);
        
        // Calculate new proficiency
        let proficiencyChange = 0;
        
        if (isCorrect) {
          // Boost proficiency for correct answers
          proficiencyChange = Math.max(10 - Math.floor(currentProficiency / 10), 2);
          
          // Handle mastery level transitions
          if (newConsecutiveCorrect >= CONSECUTIVE_THRESHOLD && newMasteryLevel === 0) {
            // Transition to first mastery level
            newMasteryLevel = 1;
            
            // Calculate new review date based on mastery level
            newReviewDue = new Date();
            newReviewDue.setDate(newReviewDue.getDate() + INITIAL_INTERVAL_DAYS);
            
            // Reset consecutive counter after advancing
            newConsecutiveCorrect = 0;
          }
          else if (newMasteryLevel > 0 && isDueForReview) {
            // Correctly remembered after disappearance - advance to next level
            newMasteryLevel += 1;
            
            // Calculate extended interval for next review
            let intervalDays = INITIAL_INTERVAL_DAYS;
            for (let i = 1; i < newMasteryLevel; i++) {
              intervalDays *= INTERVAL_MULTIPLIER;
            }
            
            newReviewDue = new Date();
            newReviewDue.setDate(newReviewDue.getDate() + Math.round(intervalDays));
            
            // Reset consecutive counter after advancing
            newConsecutiveCorrect = 0;
          }
        } else {
          // Penalty for incorrect answers
          proficiencyChange = -1 * (2 + Math.floor(currentProficiency / 25));
          
          // If in mastery mode and answer wrong during review, drop a level
          if (newMasteryLevel > 0 && isDueForReview) {
            newMasteryLevel = Math.max(0, newMasteryLevel - 1);
            
            // Calculate new review period
            if (newMasteryLevel > 0) {
              let intervalDays = INITIAL_INTERVAL_DAYS;
              for (let i = 1; i < newMasteryLevel; i++) {
                intervalDays *= INTERVAL_MULTIPLIER;
              }
              
              newReviewDue = new Date();
              newReviewDue.setDate(newReviewDue.getDate() + Math.round(intervalDays));
            } else {
              // Back to learning mode
              newReviewDue = new Date(); // Available immediately
            }
          }
        }
        
        // Calculate new proficiency value
        let newProficiency = Math.min(Math.max(currentProficiency + proficiencyChange, 0), 100);
        
        const { error: updateError } = await supabaseClient
          .from('user_kana_progress')
          .update({
            proficiency: newProficiency,
            total_practice_count: data.total_practice_count + 1,
            mistake_count: isCorrect ? data.mistake_count : data.mistake_count + 1,
            consecutive_correct: newConsecutiveCorrect,
            mastery_level: newMasteryLevel,
            last_practiced: now,
            review_due: newReviewDue.toISOString(),
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
        
        const { error: insertError } = await supabaseClient
          .from('user_kana_progress')
          .insert({
            user_id: userId,
            character_id: characterId,
            proficiency: initialProficiency,
            total_practice_count: 1,
            mistake_count: isCorrect ? 0 : 1,
            consecutive_correct: isCorrect ? 1 : 0,
            mastery_level: 0, // Start at learning phase
            last_practiced: now,
            review_due: now // Immediately available for practice
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
          result.characterId || '',
          result.correct || false
        );
      }
      console.log(`Updated progress for ${results.length} characters`);
    } catch (error) {
      console.error('Error updating progress from results:', error);
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
      
      // Calculate total proficiency with mastery bonus
      let totalScore = 0;
      let totalPossibleScore = kanaIds.length * 100; // 100% for each character is max score
      
      // For each character, calculate its contribution to the total score
      relevantProgress.forEach(progress => {
        let characterScore = progress.proficiency;
        
        // Add bonus for mastery level
        if (progress.mastery_level > 0) {
          // Mastery levels effectively make progress worth more
          characterScore = Math.min(characterScore + (progress.mastery_level * 20), 100);
        }
        
        totalScore += characterScore;
      });
      
      // Account for characters with no progress (0% proficiency)
      const trackedCharacters = new Set(relevantProgress.map(p => p.character_id));
      const untrackedCount = kanaIds.filter(id => !trackedCharacters.has(id)).length;
      
      // Calculate average proficiency across all characters
      const overallProficiency = totalScore / totalPossibleScore * 100;
      
      return Math.min(Math.round(overallProficiency), 100);
    } catch (error) {
      console.error('Error calculating overall proficiency:', error);
      return 0;
    }
  },
  
  // Get mastery statistics for kana characters
  getMasteryStats: async (userId: string, kanaType: KanaType | 'all'): Promise<{
    totalCharacters: number;
    mastered: number;
    masteryPercentage: number;
    disappearing: number; // Characters in spaced repetition
    learning: number; // Characters still being learned
  }> => {
    try {
      const userProgress = await kanaService.getUserKanaProgress(userId);
      const targetKana = kanaType === 'all' 
        ? kanaService.getAllKana() 
        : kanaService.getKanaByType(kanaType);
      
      const totalCharacters = targetKana.length;
      
      // If no progress yet, return zeros
      if (!userProgress || userProgress.length === 0) {
        return {
          totalCharacters,
          mastered: 0,
          masteryPercentage: 0,
          disappearing: 0,
          learning: 0
        };
      }
      
      // Filter progress for the target kana type
      const relevantProgress = userProgress.filter(
        progress => kanaType === 'all' || progress.character_id.startsWith(kanaType)
      );
      
      // Count characters in each category
      const mastered = relevantProgress.filter(p => p.mastery_level >= 3).length;
      const disappearing = relevantProgress.filter(p => p.mastery_level > 0 && p.mastery_level < 3).length;
      const learning = relevantProgress.filter(p => p.mastery_level === 0).length;
      
      // Calculate mastery percentage
      const masteryPercentage = (mastered / totalCharacters) * 100;
      
      return {
        totalCharacters,
        mastered,
        masteryPercentage,
        disappearing,
        learning
      };
    } catch (error) {
      console.error('Error calculating mastery stats:', error);
      return {
        totalCharacters: 0,
        mastered: 0,
        masteryPercentage: 0,
        disappearing: 0,
        learning: 0
      };
    }
  }
};
