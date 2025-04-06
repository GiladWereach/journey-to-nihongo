
import { supabaseClient } from '@/lib/supabase';
import { KanaCharacter, KanaType, UserKanaProgress } from '@/types/kana';
import { QuizCharacterSet, QuizSessionStats } from '@/types/quiz';
import { kanaService } from '@/services/kanaService';

export const getUserKanaProgress = async (userId: string): Promise<UserKanaProgress[]> => {
  try {
    if (!userId) return [];
    
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
};

// Helper function to get available character sets for quizzes
export const getAvailableCharacterSets = async (
  kanaType: KanaType
): Promise<QuizCharacterSet[]> => {
  // Basic implementation for now - we'll organize characters into logical groups
  const allKana = kanaService.getKanaByType(kanaType);
  
  // Group by consonant rows (a, ka, sa, ta, etc)
  const groups: Record<string, KanaCharacter[]> = {};
  
  // Helper to extract consonant group from character romaji
  const getConsonantGroup = (romaji: string) => {
    if (romaji.length === 1 || ['a', 'i', 'u', 'e', 'o'].includes(romaji)) {
      return 'vowels';
    }
    
    // Handle special cases
    if (romaji.startsWith('ch')) return 'ch';
    if (romaji.startsWith('sh')) return 's';
    if (romaji.startsWith('ts')) return 't';
    
    // Regular consonants
    return romaji[0];
  };
  
  // Group characters by their consonant sound
  allKana.forEach(kana => {
    const group = getConsonantGroup(kana.romaji);
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(kana);
  });
  
  // Convert groups to QuizCharacterSet format
  const characterSets: QuizCharacterSet[] = Object.entries(groups).map(([groupKey, characters]) => {
    // Convert KanaCharacter[] to QuizCharacter[]
    const quizCharacters = characters.map(kana => ({
      id: kana.id,
      character: kana.character,
      romaji: kana.romaji,
      type: kana.type,
      group: groupKey,
      quizMode: "recognition" as const
    }));
    
    let groupName = groupKey === 'vowels' ? 'Vowels' : 
                    groupKey.toUpperCase() + ' Group';
    
    return {
      id: `${kanaType}-${groupKey}`,
      name: groupName,
      description: `${characters.length} ${kanaType} characters`,
      type: kanaType,
      characters: quizCharacters,
      consonantGroup: groupKey,
      vowelGroup: groupKey === 'vowels' ? 'all' : null
    };
  });
  
  return characterSets;
};

// Function to get user's quiz statistics
export const getUserQuizStats = async (
  userId: string,
  kanaType: KanaType
): Promise<{
  totalQuizzes: number;
  averageAccuracy: number;
  bestStreak: number;
}> => {
  try {
    const { data, error } = await supabaseClient
      .from('kana_learning_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('kana_type', kanaType)
      .is('completed', true)
      .order('created_at', { ascending: false })
      .limit(20);
      
    if (error) {
      console.error('Error fetching user quiz stats:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return {
        totalQuizzes: 0,
        averageAccuracy: 0,
        bestStreak: 0
      };
    }
    
    let totalAccuracy = 0;
    let bestStreak = 0;
    
    data.forEach(session => {
      if (session.accuracy) {
        totalAccuracy += session.accuracy;
      }
      
      if (session.streak && session.streak > bestStreak) {
        bestStreak = session.streak;
      }
    });
    
    return {
      totalQuizzes: data.length,
      averageAccuracy: Math.round(totalAccuracy / data.length),
      bestStreak
    };
  } catch (error) {
    console.error('Error fetching user quiz stats:', error);
    return {
      totalQuizzes: 0,
      averageAccuracy: 0,
      bestStreak: 0
    };
  }
};

// Function to get recent quiz sessions
export const getRecentQuizSessions = async (
  userId: string,
  limit: number = 10
) => {
  try {
    const { data, error } = await supabaseClient
      .from('kana_learning_sessions')
      .select('*')
      .eq('user_id', userId)
      .is('completed', true)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching recent quiz sessions:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching recent quiz sessions:', error);
    return [];
  }
};

// Export the quizService object with all functions
export const quizService = {
  getUserKanaProgress,
  getAvailableCharacterSets,
  getUserQuizStats,
  getRecentQuizSessions
};
