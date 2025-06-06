
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { quizSessionService } from '@/services/quizSessionService';

/**
 * Hook to handle cleanup of abandoned quiz sessions
 * 
 * @param cleanup Whether to run cleanup on mount (default: true)
 * @returns void
 */
export const useSessionCleanup = (cleanup: boolean = true) => {
  const { user } = useAuth();
  
  useEffect(() => {
    // Only run if user is logged in and cleanup is enabled
    if (user && cleanup) {
      quizSessionService.cleanupAbandonedSessions(user.id)
        .then(count => {
          if (count > 0) {
            console.log(`Cleaned up ${count} abandoned quiz sessions`);
          }
        });
    }
  }, [user, cleanup]);
};
