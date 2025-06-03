
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface BasicUserProgress {
  hiragana_learned: number;
  katakana_learned: number;
  total_sessions: number;
  current_streak: number;
}

export function useUserProgress() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<BasicUserProgress | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        // Get basic progress data from user_kana_progress
        const { data: kanaProgress, error: kanaError } = await supabase
          .from('user_kana_progress')
          .select('character_id, proficiency')
          .eq('user_id', user.id);

        if (kanaError) throw kanaError;

        // Get session count
        const { data: sessions, error: sessionError } = await supabase
          .from('kana_learning_sessions')
          .select('id, streak')
          .eq('user_id', user.id)
          .eq('completed', true);

        if (sessionError) throw sessionError;

        // Calculate basic stats
        const hiraganaLearned = kanaProgress?.filter(p => 
          p.character_id.startsWith('hiragana') && p.proficiency > 0
        ).length || 0;

        const katakanaLearned = kanaProgress?.filter(p => 
          p.character_id.startsWith('katakana') && p.proficiency > 0
        ).length || 0;

        const currentStreak = sessions?.length > 0 
          ? Math.max(...sessions.map(s => s.streak || 0)) 
          : 0;

        setProgress({
          hiragana_learned: hiraganaLearned,
          katakana_learned: katakanaLearned,
          total_sessions: sessions?.length || 0,
          current_streak: currentStreak
        });
      } catch (error: any) {
        console.error('Error fetching user progress:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your learning progress',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user, toast]);

  return { progress, loading };
}
