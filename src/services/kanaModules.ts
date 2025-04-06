
// Export all kana-related services for easy import
export * from './kanaService';
export * from './kanaLearningService';
export * from './kanaProgressService';

// Re-export specific functions for direct import
import { kanaLearningService, updateKanaCharacterProgress, completeKanaLearningSession } from './kanaLearningService';
export { kanaLearningService, updateKanaCharacterProgress, completeKanaLearningSession };
