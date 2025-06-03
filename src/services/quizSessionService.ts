
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

  // End a quiz session
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
      return true;
    } catch (error) {
      console.error('Error ending quiz session:', error);
      return false;
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
  }
};
