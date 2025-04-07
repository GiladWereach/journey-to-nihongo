
import { supabaseClient } from '@/lib/supabase';
import { UserKanaProgress, KanaCharacter, KanaType } from '@/types/kana';
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
      // Force a refresh of the progress data from the database
      const { data, error } = await supabaseClient
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId);
        
      if (error) {
        throw error;
      }
      
      // Create a map for easy lookup
      const progressMap = new Map<string, any>();
      data.forEach((progress: any) => {
        progressMap.set(progress.character_id, progress);
      });
      
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
  },
  
  // Get learning streak data with a direct database query to ensure it's up-to-date
  getUserLearningStreak: async (userId: string): Promise<{
    currentStreak: number,
    longestStreak: number,
    lastPracticeDate: Date | null
  }> => {
    try {
      // First, make sure any pending study sessions are properly recorded
      // Get the last 30 days of quiz sessions
      const { data: quizSessions, error: quizError } = await supabaseClient
        .from('kana_learning_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true)
        .order('start_time', { ascending: false })
        .limit(30);
        
      if (quizError) {
        throw quizError;
      }
      
      // Get the last 30 days of study sessions
      const { data: studySessions, error: studyError } = await supabaseClient
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true)
        .order('session_date', { ascending: false })
        .limit(30);
        
      if (studyError) {
        throw studyError;
      }
      
      // Combine and sort all sessions by date
      const allSessions = [
        ...quizSessions.map((s: any) => ({ date: new Date(s.start_time), streak: s.streak || 0 })),
        ...studySessions.map((s: any) => ({ date: new Date(s.session_date), streak: 0 }))
      ].sort((a, b) => b.date.getTime() - a.date.getTime());
      
      if (allSessions.length === 0) {
        return {
          currentStreak: 0,
          longestStreak: 0,
          lastPracticeDate: null
        };
      }
      
      // Calculate current streak
      const lastSession = allSessions[0];
      const lastPracticeDate = lastSession.date;
      const today = new Date();
      
      // Check if the last session was today or yesterday to maintain streak
      const isStreakActive = (
        lastPracticeDate.toDateString() === today.toDateString() || 
        (today.getTime() - lastPracticeDate.getTime()) <= 24 * 60 * 60 * 1000
      );
      
      // Calculate longest streak
      const longestStreak = Math.max(
        ...quizSessions.map((s: any) => s.streak || 0),
        quizSessions.length > 0 ? 1 : 0
      );
      
      // If the streak is broken, return 0 as current streak
      if (!isStreakActive) {
        return {
          currentStreak: 0,
          longestStreak,
          lastPracticeDate
        };
      }
      
      return {
        currentStreak: Math.max(lastSession.streak || 1, 1),
        longestStreak,
        lastPracticeDate
      };
    } catch (error) {
      console.error('Error fetching learning streak:', error);
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastPracticeDate: null
      };
    }
  },
  
  // Get mastery level distribution
  getMasteryDistribution: async (userId: string, type: KanaType | 'all' = 'all'): Promise<{
    level0: number, // Learning phase
    level1: number, // First mastery level
    level2: number, // Second mastery level
    level3Plus: number, // Third mastery level and beyond
  }> => {
    try {
      const { data, error } = await supabaseClient
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId);
        
      if (error) {
        throw error;
      }
      
      // Filter by kana type if specified
      const filteredData = type === 'all' 
        ? data 
        : data.filter((item: any) => item.character_id.startsWith(type));
      
      // Count characters in each mastery level
      const distribution = {
        level0: 0,
        level1: 0,
        level2: 0,
        level3Plus: 0
      };
      
      filteredData.forEach((item: any) => {
        const level = item.mastery_level || 0;
        
        if (level === 0) distribution.level0++;
        else if (level === 1) distribution.level1++;
        else if (level === 2) distribution.level2++;
        else if (level >= 3) distribution.level3Plus++;
      });
      
      return distribution;
    } catch (error) {
      console.error('Error fetching mastery distribution:', error);
      return {
        level0: 0,
        level1: 0,
        level2: 0,
        level3Plus: 0
      };
    }
  },
  
  // Get progress timeline for last 14 days
  getProgressTimeline: async (userId: string, days: number = 14): Promise<{
    date: string,
    charactersStudied: number,
    averageProficiency: number
  }[]> => {
    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      // Get learning sessions in date range
      const { data: sessions, error } = await supabaseClient
        .from('kana_learning_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true)
        .gte('start_time', startDate.toISOString())
        .lte('start_time', endDate.toISOString())
        .order('start_time', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      // Generate date series for all days in range
      const dateMap = new Map<string, { 
        charactersStudied: number, 
        totalAccuracy: number,
        sessionCount: number 
      }>();
      
      // Initialize with all dates in range
      for (let i = 0; i <= days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        
        dateMap.set(dateString, {
          charactersStudied: 0,
          totalAccuracy: 0,
          sessionCount: 0
        });
      }
      
      // Populate with session data
      sessions.forEach(session => {
        const dateString = new Date(session.start_time).toISOString().split('T')[0];
        const current = dateMap.get(dateString) || {
          charactersStudied: 0,
          totalAccuracy: 0,
          sessionCount: 0
        };
        
        dateMap.set(dateString, {
          charactersStudied: current.charactersStudied + (session.characters_studied?.length || 0),
          totalAccuracy: current.totalAccuracy + (session.accuracy || 0),
          sessionCount: current.sessionCount + 1
        });
      });
      
      // Convert map to array with averages
      return Array.from(dateMap.entries()).map(([date, data]) => ({
        date,
        charactersStudied: data.charactersStudied,
        averageProficiency: data.sessionCount > 0 
          ? data.totalAccuracy / data.sessionCount
          : 0
      }));
    } catch (error) {
      console.error('Error fetching progress timeline:', error);
      return [];
    }
  }
};
