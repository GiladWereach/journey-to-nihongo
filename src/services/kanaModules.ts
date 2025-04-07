
// Export all kana-related services for easy import
import { kanaService } from '@/services/kanaService';
import { kanaProgressService } from '@/services/kanaProgressService';
import kanaLearningServiceDefault, { 
  kanaLearningService, 
  updateKanaCharacterProgress, 
  completeKanaLearningSession 
} from '@/services/kanaLearningService';

// Re-export the services for use in the app
export { 
  kanaService,
  kanaProgressService
};

// Export kanaLearningService functions
export { 
  kanaLearningService, 
  updateKanaCharacterProgress, 
  completeKanaLearningSession 
};

// Also export as default for backwards compatibility
export default kanaLearningServiceDefault;
