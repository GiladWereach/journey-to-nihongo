
// Export all kana-related services for easy import
export * from './kanaService';
export * from './kanaLearningService';
export * from './kanaProgressService';

// Re-export specific functions for direct import
import { updateKanaCharacterProgress, completeKanaLearningSession } from './kanaLearningService';
export { updateKanaCharacterProgress, completeKanaLearningSession };
