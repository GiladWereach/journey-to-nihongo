
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { enhancedCharacterProgressService, PracticeMetrics } from '@/services/enhancedCharacterProgressService';
import { useToast } from '@/hooks/use-toast';

interface QuizResult {
  character: string;
  romaji: string;
  userAnswer: string;
  correct: boolean;
  timeSpent: number;
  characterId: string;
}

export const useQuizProgress = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);

  const updateProgress = useCallback(async (
    results: QuizResult[],
    sessionId: string
  ): Promise<boolean> => {
    if (!user) {
      console.warn('No user found, cannot update progress');
      return false;
    }

    setUpdating(true);
    
    try {
      const updatePromises = results.map(async (result) => {
        const metrics: PracticeMetrics = {
          responseTime: result.timeSpent,
          isCorrect: result.correct,
          sessionId,
          characterId: result.characterId,
          timestamp: new Date()
        };

        return enhancedCharacterProgressService.updateCharacterProgressEnhanced(
          user.id,
          result.characterId,
          metrics
        );
      });

      const updateResults = await Promise.all(updatePromises);
      const successCount = updateResults.filter(Boolean).length;

      if (successCount === results.length) {
        toast({
          title: 'Progress Updated',
          description: `Successfully updated progress for ${successCount} characters`,
        });
        return true;
      } else {
        toast({
          title: 'Partial Update',
          description: `Updated ${successCount} of ${results.length} characters`,
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Error updating quiz progress:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to save your quiz progress. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setUpdating(false);
    }
  }, [user, toast]);

  return {
    updateProgress,
    updating
  };
};
