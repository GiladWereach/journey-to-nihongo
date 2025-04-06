
import { supabase } from '@/integrations/supabase/client';
import { Profile, StudySession, KanaLearningSession } from '@/types/kana';

/**
 * Centralized service for tracking and retrieving user progress data
 * across different learning activities
 */
export const progressTrackingService = {
  /**
   * Record a completed learning session
   * @param userId User ID
   * @param module Module name (e.g., 'hiragana', 'katakana', 'grammar')
   * @param topics Array of topics covered in the session
   * @param durationMinutes Duration in minutes
   * @param performanceScore Optional performance score (0-100)
   * @returns The created session or null if error
   */
  recordStudySession: async (
    userId: string,
    module: string,
    topics: string[],
    durationMinutes: number,
    performanceScore?: number
  ): Promise<StudySession | null> => {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert({
          user_id: userId,
          module,
          topics,
          duration_minutes: durationMinutes,
          session_date: new Date().toISOString(),
          completed: true,
          performance_score: performanceScore
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error recording study session:', error);
        return null;
      }
      
      return data as StudySession;
    } catch (error) {
      console.error('Error in recordStudySession:', error);
      return null;
    }
  },

  /**
   * Get a user's learning streak information using the new streak tracking table
   * @param userId User ID
   * @returns Object containing current streak, longest streak, and last practice date
   */
  getLearningStreak: async (userId: string): Promise<{
    currentStreak: number,
    longestStreak: number,
    lastPracticeDate: Date | null
  }> => {
    try {
      // Get all user streak entries sorted by date
      const { data: streakData, error: streakError } = await supabase
        .from('user_learning_streaks')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
        
      if (streakError) {
        throw streakError;
      }
      
      if (!streakData || streakData.length === 0) {
        return {
          currentStreak: 0,
          longestStreak: 0,
          lastPracticeDate: null
        };
      }
      
      // Get the latest streak date
      const lastPracticeDate = new Date(streakData[0].date);
      
      // Calculate current streak by checking consecutive days
      let currentStreak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Start with most recent practice date
      let checkDate = new Date(lastPracticeDate);
      checkDate.setHours(0, 0, 0, 0);
      
      // Check if the streak is still active (last practice was today or yesterday)
      const isStreakActive = 
        checkDate.getTime() === today.getTime() || 
        checkDate.getTime() === yesterday.getTime();
      
      if (!isStreakActive) {
        return {
          currentStreak: 0,
          longestStreak: calculateLongestStreak(streakData),
          lastPracticeDate
        };
      }
      
      // Calculate current streak by checking consecutive days from today/yesterday
      currentStreak = 1; // Start with 1 for the most recent day
      
      // Convert all dates to string format for easier comparison
      const dateStrings = streakData.map(entry => 
        new Date(entry.date).toISOString().split('T')[0]
      );
      
      // Sort dates in descending order
      dateStrings.sort().reverse();
      
      // Start from most recent date
      let currentDate = checkDate;
      
      // Check for consecutive days
      while (currentStreak < dateStrings.length) {
        const previousDate = new Date(currentDate);
        previousDate.setDate(previousDate.getDate() - 1);
        
        const previousDateStr = previousDate.toISOString().split('T')[0];
        
        if (dateStrings.includes(previousDateStr)) {
          currentStreak++;
          currentDate = previousDate;
        } else {
          break;
        }
      }
      
      return {
        currentStreak,
        longestStreak: calculateLongestStreak(streakData),
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
  
  /**
   * Get all study sessions for a user
   * @param userId User ID
   * @returns Array of study sessions
   */
  getAllStudySessions: async (userId: string): Promise<StudySession[]> => {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return data as StudySession[];
    } catch (error) {
      console.error('Error fetching study sessions:', error);
      return [];
    }
  },
  
  /**
   * Get all kana learning sessions for a user
   * @param userId User ID
   * @returns Array of kana learning sessions
   */
  getKanaLearningSessions: async (userId: string): Promise<KanaLearningSession[]> => {
    try {
      const { data, error } = await supabase
        .from('kana_learning_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return data as KanaLearningSession[];
    } catch (error) {
      console.error('Error fetching kana learning sessions:', error);
      return [];
    }
  },
  
  /**
   * Calculate total study time for a user within a given time period
   * @param userId User ID
   * @param days Number of days to look back (default: 7)
   * @returns Total study time in minutes
   */
  calculateTotalStudyTime: async (userId: string, days: number = 7): Promise<number> => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      // Get study sessions
      const { data: studySessions, error: studyError } = await supabase
        .from('study_sessions')
        .select('duration_minutes')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString());
        
      if (studyError) {
        throw studyError;
      }
      
      // Get kana learning sessions
      const { data: kanaSessions, error: kanaError } = await supabase
        .from('kana_learning_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true)
        .gte('created_at', startDate.toISOString());
        
      if (kanaError) {
        throw kanaError;
      }
      
      // Calculate total duration from study sessions
      const studyTime = (studySessions || []).reduce((total, session) => {
        return total + (session.duration_minutes || 0);
      }, 0);
      
      // Calculate duration from kana sessions (estimate 5 minutes per session if not specified)
      const kanaTime = (kanaSessions || []).reduce((total, session) => {
        // Calculate duration between start and end time if available
        if (session.start_time && session.end_time) {
          const startTime = new Date(session.start_time);
          const endTime = new Date(session.end_time);
          const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
          return total + (durationMinutes || 5); // Default to 5 minutes if calculation is invalid
        }
        return total + 5; // Default duration of 5 minutes per session
      }, 0);
      
      return studyTime + kanaTime;
    } catch (error) {
      console.error('Error calculating total study time:', error);
      return 0;
    }
  },
  
  /**
   * Calculate progress timeline data for a given period
   * @param userId User ID
   * @param days Number of days to include in the timeline
   * @returns Timeline data array
   */
  getProgressTimeline: async (userId: string, days: number = 14): Promise<{
    date: string,
    charactersStudied: number,
    averageProficiency: number
  }[]> => {
    try {
      // Get streak data which is now more reliable
      const { data: streakData, error: streakError } = await supabase
        .from('user_learning_streaks')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true });
        
      if (streakError) {
        throw streakError;
      }
      
      // Get all kana learning sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('kana_learning_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true)
        .order('start_time', { ascending: true });
        
      if (sessionsError) {
        throw sessionsError;
      }
      
      // Generate date series for all days in range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
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
      
      // Add data from streak entries to ensure active days are reflected
      (streakData || []).forEach(entry => {
        const dateString = new Date(entry.date).toISOString().split('T')[0];
        if (dateMap.has(dateString)) {
          const current = dateMap.get(dateString)!;
          dateMap.set(dateString, {
            ...current,
            // Don't override other values, just ensure this is counted as an active day
            sessionCount: Math.max(1, current.sessionCount)
          });
        }
      });
      
      // Populate with session data
      (sessions || []).forEach(session => {
        const dateString = new Date(session.start_time).toISOString().split('T')[0];
        if (dateMap.has(dateString)) {
          const current = dateMap.get(dateString)!;
          
          dateMap.set(dateString, {
            charactersStudied: current.charactersStudied + (session.characters_studied?.length || 0),
            totalAccuracy: current.totalAccuracy + (session.accuracy || 0),
            sessionCount: current.sessionCount + 1
          });
        }
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

/**
 * Utility function to calculate the longest streak from streak data
 */
function calculateLongestStreak(streakData: any[]): number {
  if (!streakData || streakData.length === 0) return 0;
  
  // Sort dates in ascending order
  const sortedDates = streakData
    .map(entry => new Date(entry.date))
    .sort((a, b) => a.getTime() - b.getTime());
    
  let longestStreak = 1;
  let currentStreak = 1;
  
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i-1]);
    const currDate = new Date(sortedDates[i]);
    
    // Check if dates are consecutive
    prevDate.setDate(prevDate.getDate() + 1);
    
    if (
      prevDate.getFullYear() === currDate.getFullYear() &&
      prevDate.getMonth() === currDate.getMonth() &&
      prevDate.getDate() === currDate.getDate()
    ) {
      currentStreak++;
    } else {
      // Reset streak if dates are not consecutive
      currentStreak = 1;
    }
    
    // Update longest streak
    longestStreak = Math.max(longestStreak, currentStreak);
  }
  
  return longestStreak;
}
