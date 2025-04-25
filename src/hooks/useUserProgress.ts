
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
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          // Explicitly cast current_stage to the correct type
          const typedData: UserLearningProgress = {
            ...data,
            current_stage: data.current_stage as "assessment" | "hiragana" | "katakana" | "kanji"
          };
          setProgress(typedData);
        } else {
          // Create new progress entry if none exists
          try {
            const { data: newProgress, error: insertError } = await supabase
              .from('user_learning_progress')
              .insert([{ 
                user_id: user.id,
                current_stage: 'assessment',
                assessment_completed: false,
                hiragana_completed: false,
                katakana_completed: false
              }])
              .select()
              .single();
              
            if (insertError) throw insertError;
            
            const typedNewData: UserLearningProgress = {
              ...newProgress,
              current_stage: newProgress.current_stage as "assessment" | "hiragana" | "katakana" | "kanji"
            };
            setProgress(typedNewData);
          } catch (insertErr: any) {
            console.error('Error creating user progress:', insertErr);
            // If insert fails (possibly due to race condition with another insert),
            // try fetching again
            const { data: refetchData, error: refetchError } = await supabase
              .from('user_learning_progress')
              .select('*')
              .eq('user_id', user.id)
              .maybeSingle();
              
            if (refetchError) throw refetchError;
            
            if (refetchData) {
              const typedRefetchData: UserLearningProgress = {
                ...refetchData,
                current_stage: refetchData.current_stage as "assessment" | "hiragana" | "katakana" | "kanji"
              };
              setProgress(typedRefetchData);
            }
          }
        }
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
          const newData = payload.new as any;
          const typedData: UserLearningProgress = {
            ...newData,
            current_stage: newData.current_stage as "assessment" | "hiragana" | "katakana" | "kanji"
          };
          setProgress(typedData);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  return { progress, loading };
}
