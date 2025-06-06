
import { supabase } from '@/integrations/supabase/client';
import { KanaType } from '@/types/kana';

export interface QuizSession {
  id: string;
  user_id: string;
  kana_type: KanaType;
  questions_answered: number;
  correct_answers: number;
  accuracy: number;
  streak: number;
  start_time: string;
  end_time?: string;
  completed: boolean;
}

export const quizSessionService = {
  // Start a new quiz session
  startSession: async (userId: string, kanaType: KanaType): Promise<QuizSession | null> => {
    try {
      // First, clean up any old incomplete sessions for this user
      await quizSessionService.cleanupAbandonedSessions(userId);
      
      const { data, error } = await supabase
        .from('kana_learning_sessions')
        .insert([{
          user_id: userId,
          kana_type: kanaType,
          questions_answered: 0,
          correct_answers: 0,
          accuracy: 0,
          streak: 0,
          completed: false
        }])
        .select()
        .single();

      if (error) throw error;
      return data as QuizSession;
    } catch (error) {
      console.error('Error starting quiz session:', error);
      return null;
    }
  },

  // Update session progress
  updateSession: async (sessionId: string, questionsAnswered: number, correctAnswers: number): Promise<boolean> => {
    try {
      const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;
      
      const { error } = await supabase
        .from('kana_learning_sessions')
        .update({
          questions_answered: questionsAnswered,
          correct_answers: correctAnswers,
          accuracy: accuracy
        })
        .eq('id', sessionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating quiz session:', error);
      return false;
    }
  },

  // End a quiz session - CRITICAL: This must be called when quiz completes
  endSession: async (sessionId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('kana_learning_sessions')
        .update({
          end_time: new Date().toISOString(),
          completed: true
        })
        .eq('id', sessionId);

      if (error) throw error;
      console.log(`Quiz session ${sessionId} marked as completed`);
      return true;
    } catch (error) {
      console.error('Error ending quiz session:', error);
      return false;
    }
  },

  // Force complete session - for when quiz ends abruptly
  forceCompleteSession: async (sessionId: string, questionsAnswered: number, correctAnswers: number): Promise<boolean> => {
    try {
      const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;
      
      const { error } = await supabase
        .from('kana_learning_sessions')
        .update({
          questions_answered: questionsAnswered,
          correct_answers: correctAnswers,
          accuracy: accuracy,
          end_time: new Date().toISOString(),
          completed: true
        })
        .eq('id', sessionId);

      if (error) throw error;
      console.log(`Quiz session ${sessionId} force completed`);
      return true;
    } catch (error) {
      console.error('Error force completing quiz session:', error);
      return false;
    }
  },

  // Cleanup abandoned sessions - any session more than 2 hours old that isn't completed
  cleanupAbandonedSessions: async (userId: string): Promise<number> => {
    try {
      // Get sessions that are incomplete and older than 2 hours
      const twoHoursAgo = new Date();
      twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);
      
      const { data, error } = await supabase
        .from('kana_learning_sessions')
        .select('id')
        .eq('user_id', userId)
        .eq('completed', false)
        .lt('start_time', twoHoursAgo.toISOString());

      if (error) throw error;
      
      if (!data || data.length === 0) return 0;
      
      // Mark these sessions as completed
      const sessionIds = data.map(session => session.id);
      
      const { error: updateError } = await supabase
        .from('kana_learning_sessions')
        .update({
          end_time: new Date().toISOString(),
          completed: true
        })
        .in('id', sessionIds);

      if (updateError) throw updateError;
      
      console.log(`Cleaned up ${data.length} abandoned sessions for user ${userId}`);
      return data.length;
    } catch (error) {
      console.error('Error cleaning up abandoned sessions:', error);
      return 0;
    }
  },

  // Get user's quiz history
  getUserSessions: async (userId: string, limit: number = 10): Promise<QuizSession[]> => {
    try {
      const { data, error } = await supabase
        .from('kana_learning_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true)
        .order('start_time', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as QuizSession[] || [];
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      return [];
    }
  },

  // Run data fix to complete abandoned sessions (for admin use)
  runDataFixForAbandonedSessions: async (): Promise<number> => {
    try {
      // Get all incomplete sessions that are older than 1 hour (more aggressive cleanup)
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      
      const { data, error } = await supabase
        .from('kana_learning_sessions')
        .select('id, questions_answered, correct_answers')
        .eq('completed', false)
        .lt('start_time', oneHourAgo.toISOString());

      if (error) throw error;
      
      if (!data || data.length === 0) return 0;
      
      // Mark these sessions as completed with proper accuracy calculation
      const updates = data.map(session => ({
        id: session.id,
        end_time: new Date().toISOString(),
        completed: true,
        accuracy: session.questions_answered > 0 
          ? Math.round((session.correct_answers / session.questions_answered) * 100) 
          : 0
      }));

      // Batch update all sessions
      for (const update of updates) {
        await supabase
          .from('kana_learning_sessions')
          .update({
            end_time: update.end_time,
            completed: update.completed,
            accuracy: update.accuracy
          })
          .eq('id', update.id);
      }
      
      console.log(`Fixed ${data.length} abandoned sessions`);
      return data.length;
    } catch (error) {
      console.error('Error fixing abandoned sessions:', error);
      return 0;
    }
  }
};
