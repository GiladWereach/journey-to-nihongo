import { supabase } from '@/integrations/supabase/client';
import { Profile, StudySession, KanaLearningSession } from '@/types/kana';

// Define the shape of the user learning streak record from our new table
interface UserLearningStreak {
  id: string;
  user_id: string;
  date: string;
  activity_count: number;
  created_at?: string;
}

// Interface for study habits analysis
interface StudyHabitsAnalysis {
  timeDistribution: {
    morning: number; // 5am-12pm
    afternoon: number; // 12pm-5pm
    evening: number; // 5pm-10pm
    night: number; // 10pm-5am
  };
  averageSessionDuration: number;
  frequencyPerWeek: number;
}

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
      
      // Also update or create a streak entry for today
      await progressTrackingService.updateLearningStreak(userId);
      
      return data as StudySession;
    } catch (error) {
      console.error('Error in recordStudySession:', error);
      return null;
    }
  },

  /**
   * Update the user's learning streak for the current day
   * @param userId User ID
   * @returns True if successful, false otherwise
   */
  updateLearningStreak: async (userId: string): Promise<boolean> => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split('T')[0];
      
      // Check if there's already an entry for today
      const { data: existingEntry, error: checkError } = await supabase
        .from('user_learning_streaks')
        .select('*')
        .eq('user_id', userId)
        .eq('date', todayStr)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" which is expected
        console.error('Error checking streak entry:', checkError);
        return false;
      }
      
      if (existingEntry) {
        // Update existing entry
        const { error: updateError } = await supabase
          .from('user_learning_streaks')
          .update({ 
            activity_count: (existingEntry as UserLearningStreak).activity_count + 1
          })
          .eq('id', (existingEntry as UserLearningStreak).id);
          
        if (updateError) {
          console.error('Error updating streak entry:', updateError);
          return false;
        }
      } else {
        // Create new entry
        const { error: insertError } = await supabase
          .from('user_learning_streaks')
          .insert({
            user_id: userId,
            date: todayStr,
            activity_count: 1
          });
          
        if (insertError) {
          console.error('Error creating streak entry:', insertError);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateLearningStreak:', error);
      return false;
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
      // Use a raw query to avoid TypeScript errors with the new table
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
      
      // Cast the data to our interface to ensure type safety
      const typedStreakData = streakData as unknown as UserLearningStreak[];
      
      // Get the latest streak date
      const lastPracticeDate = new Date(typedStreakData[0].date);
      
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
          longestStreak: calculateLongestStreak(typedStreakData),
          lastPracticeDate
        };
      }
      
      // Calculate current streak by checking consecutive days from today/yesterday
      currentStreak = 1; // Start with 1 for the most recent day
      
      // Convert all dates to string format for easier comparison
      const dateStrings = typedStreakData.map(entry => 
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
        longestStreak: calculateLongestStreak(typedStreakData),
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
      // Use a raw query to avoid TypeScript errors with the new table
      const { data: streakData, error: streakError } = await supabase
        .from('user_learning_streaks')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true });
        
      if (streakError) {
        throw streakError;
      }
      
      // Cast the data to our interface to ensure type safety
      const typedStreakData = streakData as unknown as UserLearningStreak[];
      
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
      (typedStreakData || []).forEach(entry => {
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
  },
  
  /**
   * Analyze study habits by looking at session times and patterns
   * @param userId User ID
   * @returns Object with time distribution and other study habit metrics
   */
  analyzeStudyHabits: async (userId: string): Promise<StudyHabitsAnalysis> => {
    try {
      // Get all study sessions for the user
      const { data: studySessions, error: studySessionsError } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('session_date', { ascending: false });
      
      if (studySessionsError) {
        throw studySessionsError;
      }
      
      // Get kana learning sessions for the user
      const { data: kanaSessions, error: kanaSessionsError } = await supabase
        .from('kana_learning_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true)
        .order('start_time', { ascending: false });
        
      if (kanaSessionsError) {
        throw kanaSessionsError;
      }
      
      // Default return for new users with no data
      const defaultAnalysis: StudyHabitsAnalysis = {
        timeDistribution: {
          morning: 25,
          afternoon: 30,
          evening: 40,
          night: 5
        },
        averageSessionDuration: 15,
        frequencyPerWeek: 3.5
      };
      
      // If no data, return default values
      if ((!studySessions || studySessions.length === 0) && 
          (!kanaSessions || kanaSessions.length === 0)) {
        return defaultAnalysis;
      }
      
      // Calculate time distribution
      let morningCount = 0;
      let afternoonCount = 0;
      let eveningCount = 0;
      let nightCount = 0;
      let totalDuration = 0;
      
      // Process study sessions
      (studySessions || []).forEach((session: any) => {
        if (!session.session_date) return;
        
        const sessionDate = new Date(session.session_date);
        const hour = sessionDate.getHours();
        
        // Categorize by time of day
        if (hour >= 5 && hour < 12) {
          morningCount++;
        } else if (hour >= 12 && hour < 17) {
          afternoonCount++;
        } else if (hour >= 17 && hour < 22) {
          eveningCount++;
        } else {
          nightCount++;
        }
        
        // Add to total duration
        totalDuration += session.duration_minutes || 0;
      });
      
      // Process kana sessions
      (kanaSessions || []).forEach((session: any) => {
        if (!session.start_time) return;
        
        const sessionDate = new Date(session.start_time);
        const hour = sessionDate.getHours();
        
        // Categorize by time of day
        if (hour >= 5 && hour < 12) {
          morningCount++;
        } else if (hour >= 12 && hour < 17) {
          afternoonCount++;
        } else if (hour >= 17 && hour < 22) {
          eveningCount++;
        } else {
          nightCount++;
        }
        
        // Add an estimated duration for kana sessions (5 minutes if not specified)
        if (session.start_time && session.end_time) {
          const startTime = new Date(session.start_time);
          const endTime = new Date(session.end_time);
          const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
          totalDuration += (durationMinutes > 0 ? durationMinutes : 5);
        } else {
          totalDuration += 5; // Default duration
        }
      });
      
      // Calculate total sessions
      const totalSessions = (studySessions?.length || 0) + (kanaSessions?.length || 0);
      
      // Calculate average session duration
      const averageSessionDuration = totalSessions > 0 
        ? Math.round(totalDuration / totalSessions)
        : 15; // Default to 15 minutes if no data
      
      // Calculate normalized time distribution percentages
      const totalTimeEntries = morningCount + afternoonCount + eveningCount + nightCount;
      const timeDistribution = {
        morning: totalTimeEntries > 0 ? Math.round((morningCount / totalTimeEntries) * 100) : 25,
        afternoon: totalTimeEntries > 0 ? Math.round((afternoonCount / totalTimeEntries) * 100) : 30,
        evening: totalTimeEntries > 0 ? Math.round((eveningCount / totalTimeEntries) * 100) : 40,
        night: totalTimeEntries > 0 ? Math.round((nightCount / totalTimeEntries) * 100) : 5
      };
      
      // Calculate weekly frequency (average days per week with activity)
      let frequencyPerWeek = 3.5; // Default
      
      // Get streak data to calculate weekly frequency
      const { data: streakData, error: streakError } = await supabase
        .from('user_learning_streaks')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(30); // Last 30 days of data
        
      if (!streakError && streakData && streakData.length > 0) {
        // Calculate number of weeks represented in the data
        const oldestDate = new Date(streakData[streakData.length - 1].date);
        const newestDate = new Date(streakData[0].date);
        const daysDifference = Math.max(1, Math.round((newestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24)));
        const weeksDifference = Math.max(1, Math.ceil(daysDifference / 7));
        
        // Calculate average days per week
        frequencyPerWeek = Math.min(7, Math.round((streakData.length / weeksDifference) * 10) / 10);
      }
      
      return {
        timeDistribution,
        averageSessionDuration,
        frequencyPerWeek
      };
    } catch (error) {
      console.error('Error analyzing study habits:', error);
      return {
        timeDistribution: {
          morning: 25,
          afternoon: 30,
          evening: 40,
          night: 5
        },
        averageSessionDuration: 15,
        frequencyPerWeek: 3.5
      };
    }
  }
};

/**
 * Utility function to calculate the longest streak from streak data
 */
function calculateLongestStreak(streakData: UserLearningStreak[]): number {
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
