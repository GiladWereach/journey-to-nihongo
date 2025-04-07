
// Export all kana-related services for easy import
export * from './kanaService';
export * from './kanaLearningService';
export * from './kanaProgressService';

// Re-export specific functions for direct import 
import { kanaLearningService, updateKanaCharacterProgress, completeKanaLearningSession } from './kanaLearningService';
import { kanaService } from './kanaService';

export { 
  kanaLearningService, 
  updateKanaCharacterProgress, 
  completeKanaLearningSession,
  kanaService
};
