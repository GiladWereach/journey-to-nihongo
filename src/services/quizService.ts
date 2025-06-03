import { supabaseClient } from '@/lib/supabase';
import { KanaType, QuizCharacterSet, QuizCharacter } from '@/types/quiz';
import { UserKanaProgress } from '@/types/kana';
import { hiraganaCharacters } from '@/data/hiraganaData';
import { katakanaCharacters } from '@/data/katakanaData';
import { calculateNextReviewDate } from '@/lib/utils';

// Create and export the quizService
export const quizService = {
  // Get all available character sets for quiz
  getAvailableCharacterSets: async (type: KanaType): Promise<QuizCharacterSet[]> => {
    try {
      // Get all kana characters of the specified type
      const allKana = type === 'hiragana' ? hiraganaCharacters : katakanaCharacters;
      
      // Define character groupings
      const characterSets: QuizCharacterSet[] = [];
      
      // Helper function to create QuizCharacter with required properties
      const createQuizCharacter = (kana: any): QuizCharacter => ({
        id: kana.id,
        character: kana.character,
        romaji: kana.romaji,
        type,
        stroke_count: kana.stroke_count || 1,
        stroke_order: kana.stroke_order || []
      });
      
      // 1. Basic vowels
      const vowels = allKana.filter(k => /^(a|i|u|e|o)$/.test(k.romaji));
      if (vowels.length > 0) {
        characterSets.push({
          id: `${type}-vowels`,
          name: 'Vowels',
          description: 'Basic vowel sounds',
          type,
          characters: vowels.map(createQuizCharacter)
        });
      }
      
      // 2. K-row
      const kRow = allKana.filter(k => /^k[aiueo]$/.test(k.romaji));
      if (kRow.length > 0) {
        characterSets.push({
          id: `${type}-k-row`,
          name: 'K Row',
          description: 'Ka, Ki, Ku, Ke, Ko',
          type,
          characters: kRow.map(createQuizCharacter)
        });
      }
      
      // 3. S-row
      const sRow = allKana.filter(k => /^s[aiueo]$/.test(k.romaji));
      if (sRow.length > 0) {
        characterSets.push({
          id: `${type}-s-row`,
          name: 'S Row',
          description: 'Sa, Shi, Su, Se, So',
          type,
          characters: sRow.map(createQuizCharacter)
        });
      }
      
      // 4. T-row
      const tRow = allKana.filter(k => /^t[aiueo]$/.test(k.romaji));
      if (tRow.length > 0) {
        characterSets.push({
          id: `${type}-t-row`,
          name: 'T Row',
          description: 'Ta, Chi, Tsu, Te, To',
          type,
          characters: tRow.map(createQuizCharacter)
        });
      }
      
      // Continue with other rows...
      const nRow = allKana.filter(k => /^n[aiueo]$/.test(k.romaji));
      if (nRow.length > 0) {
        characterSets.push({
          id: `${type}-n-row`,
          name: 'N Row',
          description: 'Na, Ni, Nu, Ne, No',
          type,
          characters: nRow.map(createQuizCharacter)
        });
      }
      
      const hRow = allKana.filter(k => /^h[aiueo]$/.test(k.romaji));
      if (hRow.length > 0) {
        characterSets.push({
          id: `${type}-h-row`,
          name: 'H Row',
          description: 'Ha, Hi, Fu, He, Ho',
          type,
          characters: hRow.map(createQuizCharacter)
        });
      }
      
      const mRow = allKana.filter(k => /^m[aiueo]$/.test(k.romaji));
      if (mRow.length > 0) {
        characterSets.push({
          id: `${type}-m-row`,
          name: 'M Row',
          description: 'Ma, Mi, Mu, Me, Mo',
          type,
          characters: mRow.map(createQuizCharacter)
        });
      }
      
      const yRow = allKana.filter(k => /^y[auo]$/.test(k.romaji));
      if (yRow.length > 0) {
        characterSets.push({
          id: `${type}-y-row`,
          name: 'Y Row',
          description: 'Ya, Yu, Yo',
          type,
          characters: yRow.map(createQuizCharacter)
        });
      }
      
      const rRow = allKana.filter(k => /^r[aiueo]$/.test(k.romaji));
      if (rRow.length > 0) {
        characterSets.push({
          id: `${type}-r-row`,
          name: 'R Row',
          description: 'Ra, Ri, Ru, Re, Ro',
          type,
          characters: rRow.map(createQuizCharacter)
        });
      }
      
      const wRow = allKana.filter(k => /^w[aoe]$/.test(k.romaji));
      if (wRow.length > 0) {
        characterSets.push({
          id: `${type}-w-row`,
          name: 'W Row',
          description: 'Wa, Wo',
          type,
          characters: wRow.map(createQuizCharacter)
        });
      }
      
      const special = allKana.filter(k => /^n$/.test(k.romaji));
      if (special.length > 0) {
        characterSets.push({
          id: `${type}-special`,
          name: 'Special',
          description: 'Special characters',
          type,
          characters: special.map(createQuizCharacter)
        });
      }
      
      return characterSets;
    } catch (error) {
      console.error('Error fetching character sets:', error);
      return [];
    }
  },
  
  // Get user's kana progress
  getUserKanaProgress: async (userId: string, type?: KanaType): Promise<UserKanaProgress[]> => {
    try {
      let query = supabaseClient
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId);
      
      if (type) {
        query = query.ilike('character_id', `${type}%`);
      }
      
      const { data, error } = await query;
        
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
      }));
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return [];
    }
  },
  
  // Get user's quiz statistics
  getUserQuizStats: async (userId: string, kanaType?: KanaType): Promise<{
    totalQuizzes: number;
    averageAccuracy: number;
    bestStreak: number;
  }> => {
    try {
      let query = supabaseClient
        .from('kana_learning_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true);
      
      if (kanaType) {
        query = query.eq('kana_type', kanaType);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching quiz stats:', error);
        throw error;
      }
      
      // Calculate statistics
      const totalQuizzes = data.length;
      
      // Calculate average accuracy
      const accuracySum = data.reduce((sum, session) => sum + (session.accuracy || 0), 0);
      const averageAccuracy = totalQuizzes > 0 ? Math.round(accuracySum / totalQuizzes) : 0;
      
      // Find best streak
      const bestStreak = data.length > 0 ? Math.max(...data.map(session => session.streak || 0)) : 0;
      
      return {
        totalQuizzes,
        averageAccuracy,
        bestStreak
      };
    } catch (error) {
      console.error('Error calculating quiz stats:', error);
      return {
        totalQuizzes: 0,
        averageAccuracy: 0,
        bestStreak: 0
      };
    }
  },
  
  // Update user's kana progress for a specific character
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
      
      // If we already have a record, update it - this prevents database overload
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
        
        // Constant for consecutive correct threshold
        const CONSECUTIVE_THRESHOLD = 8;
        
        if (isCorrect) {
          // Boost proficiency for correct answers
          proficiencyChange = Math.max(10 - Math.floor(currentProficiency / 10), 2);
          
          // Handle mastery level transitions
          if (newConsecutiveCorrect >= CONSECUTIVE_THRESHOLD && newMasteryLevel === 0) {
            // Transition to first mastery level
            newMasteryLevel = 1;
            
            // Calculate new review date based on mastery level
            newReviewDue = calculateNextReviewDate(currentProficiency, newMasteryLevel);
            
            // Reset consecutive counter after advancing
            newConsecutiveCorrect = 0;
          }
          else if (newMasteryLevel > 0 && isDueForReview) {
            // Correctly remembered after disappearance - advance to next level
            newMasteryLevel += 1;
            
            // Calculate extended interval for next review
            newReviewDue = calculateNextReviewDate(currentProficiency, newMasteryLevel);
            
            // Reset consecutive counter after advancing
            newConsecutiveCorrect = 0;
          }
        } else {
          // Penalty for incorrect answers - higher penalty for more proficient characters
          proficiencyChange = -1 * (2 + Math.floor(currentProficiency / 25));
          
          // If in mastery mode and answer wrong during review, drop a level
          if (newMasteryLevel > 0 && isDueForReview) {
            newMasteryLevel = Math.max(0, newMasteryLevel - 1);
            
            // Calculate new review period
            if (newMasteryLevel > 0) {
              newReviewDue = calculateNextReviewDate(currentProficiency, newMasteryLevel);
            } else {
              // Back to learning mode
              newReviewDue = new Date(); // Available immediately
            }
          }
        }
        
        // Calculate new proficiency value (clamped to 0-100)
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
  
  // Record quiz session
  recordQuizSession: async (
    userId: string,
    quizData: {
      kanaType: KanaType;
      characterIds: string[];
      startTime: Date;
      endTime: Date;
      correctCount: number;
      totalAttempts: number;
      streak?: number;
    }
  ): Promise<string | null> => {
    try {
      // Calculate streak if not provided
      let streak = quizData.streak || 0;
      
      // If streak is not provided, check most recent session
      if (!quizData.streak) {
        const { data: recentSessions } = await supabaseClient
          .from('kana_learning_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('start_time', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        // Calculate current streak
        if (recentSessions) {
          // If the last session had a streak and the accuracy was good (>70%)
          if (recentSessions.streak && recentSessions.accuracy && recentSessions.accuracy >= 70) {
            // Continue the streak
            streak = recentSessions.streak + 1;
          } else {
            // Start a new streak
            streak = 1;
          }
        } else {
          // First session - start with streak of 1
          streak = 1;
        }
      }
      
      // Calculate accuracy
      const accuracy = Math.round((quizData.correctCount / Math.max(quizData.totalAttempts, 1)) * 100);
      
      // Reset streak if accuracy is poor
      if (accuracy < 50) {
        streak = 0;
      }
      
      // Fix: Store only the character IDs, not the full objects
      // This prevents invalid UUID errors
      const characterIdsOnly = quizData.characterIds.map(id => {
        // If the id contains a hyphen (like "hiragana-a"), extract just the UUID part
        // Or if it's already a UUID, use it as is
        return id.includes('-') ? id.split('-')[1] : id;
      });
      
      const { data, error } = await supabaseClient
        .from('kana_learning_sessions')
        .insert({
          user_id: userId,
          kana_type: quizData.kanaType,
          characters_studied: characterIdsOnly,
          start_time: quizData.startTime.toISOString(),
          end_time: quizData.endTime.toISOString(),
          accuracy: accuracy,
          streak: streak,
          completed: true
        })
        .select('id')
        .single();
        
      if (error) {
        console.error('Error recording quiz session:', error);
        return null;
      }
      
      return data.id;
    } catch (error) {
      console.error('Error recording quiz session:', error);
      return null;
    }
  },
  
  // Get user's recent quiz sessions
  getRecentQuizSessions: async (
    userId: string,
    limit: number = 5
  ): Promise<any[]> => {
    try {
      const { data, error } = await supabaseClient
        .from('kana_learning_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true)
        .order('start_time', { ascending: false })
        .limit(limit);
        
      if (error) {
        console.error('Error fetching quiz sessions:', error);
        return [];
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching quiz sessions:', error);
      return [];
    }
  },
  
  // Get characters for a quick quiz
  getQuickQuizCharacters: async (type: KanaType, userId?: string, limit: number = 10): Promise<QuizCharacter[]> => {
    try {
      // Get base characters for the selected type
      const allKana = type === 'hiragana' ? 
        hiraganaCharacters : 
        type === 'katakana' ? 
          katakanaCharacters : 
          [...hiraganaCharacters, ...katakanaCharacters];
      
      let characters: QuizCharacter[] = [];
      
      // If user is logged in, prioritize characters based on their progress
      if (userId) {
        const { data: progressData } = await supabaseClient
          .from('user_kana_progress')
          .select('*')
          .eq('user_id', userId);
        
        if (progressData && progressData.length > 0) {
          // Sort characters by priority:
          // 1. Characters due for review
          // 2. Characters with low proficiency
          // 3. Characters they haven't practiced yet
          
          const now = new Date();
          const userProgress = progressData.map(p => ({
            ...p,
            review_due: new Date(p.review_due),
            proficiency: p.proficiency || 0
          }));
          
          // Map characters with their priority scores
          const scoredCharacters = allKana.map(kana => {
            const progress = userProgress.find(p => p.character_id === kana.id);
            
            // Calculate priority score
            let priorityScore = 0;
            
            if (!progress) {
              // New characters get medium priority
              priorityScore = 50; 
            } else if (progress.review_due <= now) {
              // Due for review - high priority
              priorityScore = 100 - progress.proficiency; 
            } else {
              // Not due yet - lower priority based on proficiency
              priorityScore = 40 - (progress.proficiency / 2.5);
            }
            
            return {
              character: kana,
              priorityScore
            };
          });
          
          // Sort by priority score (higher = more important)
          scoredCharacters.sort((a, b) => b.priorityScore - a.priorityScore);
          
          // Take top N characters
          characters = scoredCharacters.slice(0, limit).map(sc => ({
            id: sc.character.id,
            character: sc.character.character,
            romaji: sc.character.romaji,
            type: sc.character.type as KanaType,
            quizMode: 'both' as const,
            stroke_count: sc.character.stroke_count || 1,
            stroke_order: sc.character.stroke_order || []
          }));
        }
      }
      
      // If we don't have enough characters yet (or no user), add random ones
      if (characters.length < limit) {
        const remainingChars = allKana.filter(kana => 
          !characters.some(c => c.id === kana.id)
        );
        
        // Shuffle remaining characters
        const shuffled = [...remainingChars].sort(() => Math.random() - 0.5);
        
        // Add enough to reach the limit
        const additional = shuffled.slice(0, limit - characters.length).map(kana => ({
          id: kana.id,
          character: kana.character,
          romaji: kana.romaji,
          type: kana.type as KanaType,
          quizMode: 'both' as const,
          stroke_count: kana.stroke_count || 1,
          stroke_order: kana.stroke_order || []
        }));
        
        characters = [...characters, ...additional];
      }
      
      // Final shuffle to prevent predictability
      return characters.sort(() => Math.random() - 0.5);
    } catch (error) {
      console.error('Error preparing quick quiz characters:', error);
      return [];
    }
  }
};
