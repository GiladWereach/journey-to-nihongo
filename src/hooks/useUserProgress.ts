
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserLearningProgress } from '@/types/progress';
import { useToast } from '@/components/ui/use-toast';

export function useUserProgress() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<UserLearningProgress | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('user_learning_progress')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setProgress(data);
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

    // Subscribe to realtime progress updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_learning_progress',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setProgress(payload.new as UserLearningProgress);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  return { progress, loading };
}
