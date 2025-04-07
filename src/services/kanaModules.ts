
// Export all kana-related services for easy import
import { kanaService } from '@/services/kanaService';
import { kanaLearningService, updateKanaCharacterProgress, completeKanaLearningSession } from '@/services/kanaLearningService';
import { kanaProgressService } from '@/services/kanaProgressService';

// Re-export the services for use in the app
export { 
  kanaService,
  kanaLearningService, 
  updateKanaCharacterProgress, 
  completeKanaLearningSession,
  kanaProgressService
};
