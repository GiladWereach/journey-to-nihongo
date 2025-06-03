
import { supabase } from '@/integrations/supabase/client';
import { UserKanaProgress } from '@/types/kana';

export interface EnhancedUserKanaProgress extends UserKanaProgress {
  confidence_score: number;
  average_response_time: number;
  sessions_practiced: number;
  first_seen_at: Date;
  graduation_date: Date | null;
  last_mistake_date: Date | null;
  similar_character_confusions: Record<string, number>;
}

export interface CharacterSelectionWeights {
  new: number;
  learning: number;
  familiar: number;
  practiced: number;
  reliable: number;
  mastered: number;
}

export interface PracticeMetrics {
  responseTime: number;
  isCorrect: boolean;
  sessionId: string;
  characterId: string;
  timestamp: Date;
}

export const enhancedCharacterProgressService = {
  // Mastery level thresholds
  MASTERY_THRESHOLDS: {
    NEW: 0,
    LEARNING: 1,
    FAMILIAR: 10,
    PRACTICED: 20,
    RELIABLE: 30,
    MASTERED: 50
  },

  // Character selection weights (higher = more likely to be selected)
  SELECTION_WEIGHTS: {
    new: 10,      // Highest priority for new characters
    learning: 8,   // High priority for learning
    familiar: 6,   // Medium-high priority
    practiced: 4,  // Medium priority
    reliable: 2,   // Low priority
    mastered: 1    // Lowest priority (maintenance only)
  } as CharacterSelectionWeights,

  // Calculate mastery stage based on progress metrics
  calculateMasteryStage: (progress: EnhancedUserKanaProgress): number => {
    const { consecutive_correct, proficiency, average_response_time, sessions_practiced } = progress;
    
    if (consecutive_correct >= enhancedCharacterProgressService.MASTERY_THRESHOLDS.MASTERED && 
        proficiency >= 95 && 
        average_response_time <= 2000 && 
        sessions_practiced >= 5) {
      return 5; // MASTERED
    } else if (consecutive_correct >= enhancedCharacterProgressService.MASTERY_THRESHOLDS.RELIABLE && 
               proficiency >= 90 && 
               sessions_practiced >= 4) {
      return 4; // RELIABLE
    } else if (consecutive_correct >= enhancedCharacterProgressService.MASTERY_THRESHOLDS.PRACTICED && 
               proficiency >= 80 && 
               sessions_practiced >= 3) {
      return 3; // PRACTICED
    } else if (consecutive_correct >= enhancedCharacterProgressService.MASTERY_THRESHOLDS.FAMILIAR && 
               proficiency >= 70) {
      return 2; // FAMILIAR
    } else if (consecutive_correct >= enhancedCharacterProgressService.MASTERY_THRESHOLDS.LEARNING) {
      return 1; // LEARNING
    }
    
    return 0; // NEW
  },

  // Calculate confidence score based on multiple factors
  calculateConfidenceScore: (progress: EnhancedUserKanaProgress): number => {
    const { proficiency, consecutive_correct, average_response_time, sessions_practiced, mistake_count, total_practice_count } = progress;
    
    // Base score from proficiency (0-40 points)
    let score = Math.floor(proficiency * 0.4);
    
    // Consistency bonus (0-25 points)
    const consistencyRatio = consecutive_correct / Math.max(total_practice_count, 1);
    score += Math.floor(consistencyRatio * 25);
    
    // Speed bonus (0-20 points)
    if (average_response_time > 0) {
      const speedScore = Math.max(0, 20 - Math.floor(average_response_time / 200));
      score += speedScore;
    }
    
    // Session stability bonus (0-10 points)
    const sessionBonus = Math.min(sessions_practiced * 2, 10);
    score += sessionBonus;
    
    // Error penalty (-5 points per recent mistake)
    const errorPenalty = Math.min(mistake_count * 5, 20);
    score = Math.max(0, score - errorPenalty);
    
    return Math.min(100, Math.max(0, score));
  },

  // Enhanced progress update with timing and session tracking
  updateCharacterProgressEnhanced: async (
    userId: string, 
    characterId: string, 
    metrics: PracticeMetrics
  ): Promise<boolean> => {
    try {
      const { data: existing, error: fetchError } = await supabase
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('character_id', characterId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      const now = new Date().toISOString();
      const isCorrect = metrics.isCorrect;

      if (existing) {
        // Calculate new metrics
        const newTotalCount = (existing.total_practice_count || 0) + 1;
        const newMistakeCount = existing.mistake_count + (isCorrect ? 0 : 1);
        const newConsecutiveCorrect = isCorrect ? (existing.consecutive_correct || 0) + 1 : 0;
        
        // Update proficiency with more nuanced changes
        const proficiencyChange = isCorrect ? 
          Math.max(2, 15 - Math.floor(existing.proficiency / 10)) : // Smaller gains as proficiency increases
          -Math.max(3, Math.floor(existing.proficiency / 20)); // Smaller losses for higher proficiency
        const newProficiency = Math.min(Math.max((existing.proficiency || 0) + proficiencyChange, 0), 100);

        // Update average response time
        const currentAvg = existing.average_response_time || 0;
        const newAvgResponseTime = currentAvg === 0 ? 
          metrics.responseTime : 
          Math.floor((currentAvg * (newTotalCount - 1) + metrics.responseTime) / newTotalCount);

        // Calculate new confidence score
        const tempProgress: EnhancedUserKanaProgress = {
          ...existing,
          proficiency: newProficiency,
          consecutive_correct: newConsecutiveCorrect,
          average_response_time: newAvgResponseTime,
          sessions_practiced: existing.sessions_practiced || 1,
          mistake_count: newMistakeCount,
          total_practice_count: newTotalCount,
          confidence_score: existing.confidence_score || 0,
          first_seen_at: new Date(existing.first_seen_at || existing.last_practiced),
          graduation_date: existing.graduation_date ? new Date(existing.graduation_date) : null,
          last_mistake_date: existing.last_mistake_date ? new Date(existing.last_mistake_date) : null,
          similar_character_confusions: typeof existing.similar_character_confusions === 'object' 
            ? existing.similar_character_confusions as Record<string, number>
            : {},
          last_practiced: new Date(existing.last_practiced),
          review_due: new Date(existing.review_due)
        };

        const newConfidenceScore = enhancedCharacterProgressService.calculateConfidenceScore(tempProgress);
        const newMasteryLevel = enhancedCharacterProgressService.calculateMasteryStage(tempProgress);

        // Check for graduation to mastery
        const graduationDate = newMasteryLevel === 5 && existing.mastery_level < 5 ? now : existing.graduation_date;

        // Calculate next review due (spaced repetition)
        const intervalHours = Math.pow(2, newMasteryLevel) * (isCorrect ? 1 : 0.5);
        const reviewDue = new Date(Date.now() + intervalHours * 60 * 60 * 1000).toISOString();

        const { error: updateError } = await supabase
          .from('user_kana_progress')
          .update({
            proficiency: newProficiency,
            confidence_score: newConfidenceScore,
            total_practice_count: newTotalCount,
            mistake_count: newMistakeCount,
            consecutive_correct: newConsecutiveCorrect,
            mastery_level: newMasteryLevel,
            average_response_time: newAvgResponseTime,
            sessions_practiced: existing.sessions_practiced || 1,
            last_practiced: now,
            last_mistake_date: isCorrect ? existing.last_mistake_date : now,
            graduation_date: graduationDate,
            review_due: reviewDue,
            updated_at: now
          })
          .eq('id', existing.id);

        if (updateError) throw updateError;
      } else {
        // Create new progress entry
        const initialProficiency = isCorrect ? 15 : 5;
        const initialConfidenceScore = isCorrect ? 20 : 10;
        const intervalHours = isCorrect ? 2 : 1;
        const reviewDue = new Date(Date.now() + intervalHours * 60 * 60 * 1000).toISOString();

        const { error: insertError } = await supabase
          .from('user_kana_progress')
          .insert({
            user_id: userId,
            character_id: characterId,
            proficiency: initialProficiency,
            confidence_score: initialConfidenceScore,
            total_practice_count: 1,
            mistake_count: isCorrect ? 0 : 1,
            consecutive_correct: isCorrect ? 1 : 0,
            mastery_level: isCorrect ? 1 : 0,
            average_response_time: metrics.responseTime,
            sessions_practiced: 1,
            first_seen_at: now,
            last_practiced: now,
            last_mistake_date: isCorrect ? null : now,
            review_due: reviewDue
          });

        if (insertError) throw insertError;
      }

      return true;
    } catch (error) {
      console.error('Error updating enhanced character progress:', error);
      return false;
    }
  },

  // Intelligent character selection for quiz
  selectNextCharacter: async (
    userId: string, 
    availableCharacters: string[], 
    sessionId: string
  ): Promise<string> => {
    try {
      // Get current progress for all available characters
      const { data: progressData, error } = await supabase
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId)
        .in('character_id', availableCharacters);

      if (error) throw error;

      // Create a map of existing progress
      const progressMap = new Map();
      progressData?.forEach(p => progressMap.set(p.character_id, p));

      // Calculate weights for each character
      const weightedCharacters: Array<{ characterId: string; weight: number }> = [];

      for (const characterId of availableCharacters) {
        const progress = progressMap.get(characterId);
        let weight = 1;

        if (!progress) {
          // New character - highest priority
          weight = enhancedCharacterProgressService.SELECTION_WEIGHTS.new;
        } else {
          // Convert progress to enhanced format for calculation
          const enhancedProgress: EnhancedUserKanaProgress = {
            ...progress,
            confidence_score: progress.confidence_score || 0,
            average_response_time: progress.average_response_time || 0,
            sessions_practiced: progress.sessions_practiced || 0,
            first_seen_at: new Date(progress.first_seen_at || progress.last_practiced),
            graduation_date: progress.graduation_date ? new Date(progress.graduation_date) : null,
            last_mistake_date: progress.last_mistake_date ? new Date(progress.last_mistake_date) : null,
            similar_character_confusions: typeof progress.similar_character_confusions === 'object' 
              ? progress.similar_character_confusions as Record<string, number>
              : {},
            last_practiced: new Date(progress.last_practiced),
            review_due: new Date(progress.review_due)
          };

          const masteryStage = enhancedCharacterProgressService.calculateMasteryStage(enhancedProgress);
          const confidenceScore = progress.confidence_score || 0;
          
          // Base weight on mastery stage
          switch (masteryStage) {
            case 0: weight = enhancedCharacterProgressService.SELECTION_WEIGHTS.new; break;
            case 1: weight = enhancedCharacterProgressService.SELECTION_WEIGHTS.learning; break;
            case 2: weight = enhancedCharacterProgressService.SELECTION_WEIGHTS.familiar; break;
            case 3: weight = enhancedCharacterProgressService.SELECTION_WEIGHTS.practiced; break;
            case 4: weight = enhancedCharacterProgressService.SELECTION_WEIGHTS.reliable; break;
            case 5: weight = enhancedCharacterProgressService.SELECTION_WEIGHTS.mastered; break;
          }

          // Adjust weight based on confidence score (lower confidence = higher weight)
          const confidenceMultiplier = Math.max(0.1, (100 - confidenceScore) / 100);
          weight *= confidenceMultiplier;

          // Boost weight for characters due for review
          if (progress.review_due && new Date(progress.review_due) <= new Date()) {
            weight *= 2;
          }

          // Boost weight for characters with recent mistakes
          if (progress.last_mistake_date) {
            const daysSinceError = (Date.now() - new Date(progress.last_mistake_date).getTime()) / (1000 * 60 * 60 * 24);
            if (daysSinceError < 3) {
              weight *= 1.5;
            }
          }
        }

        weightedCharacters.push({ characterId, weight });
      }

      // Weighted random selection
      const totalWeight = weightedCharacters.reduce((sum, char) => sum + char.weight, 0);
      let random = Math.random() * totalWeight;

      for (const char of weightedCharacters) {
        random -= char.weight;
        if (random <= 0) {
          return char.characterId;
        }
      }

      // Fallback to random selection
      return availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
    } catch (error) {
      console.error('Error selecting next character:', error);
      // Fallback to random selection
      return availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
    }
  },

  // Get enhanced character progress with all new fields
  getEnhancedCharacterProgress: async (userId: string, characterIds?: string[]): Promise<EnhancedUserKanaProgress[]> => {
    try {
      let query = supabase
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId);

      if (characterIds && characterIds.length > 0) {
        query = query.in('character_id', characterIds);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        character_id: item.character_id,
        proficiency: item.proficiency,
        confidence_score: item.confidence_score || 0,
        mistake_count: item.mistake_count,
        total_practice_count: item.total_practice_count,
        consecutive_correct: item.consecutive_correct,
        mastery_level: item.mastery_level,
        average_response_time: item.average_response_time || 0,
        sessions_practiced: item.sessions_practiced || 0,
        last_practiced: new Date(item.last_practiced),
        first_seen_at: new Date(item.first_seen_at || item.last_practiced),
        graduation_date: item.graduation_date ? new Date(item.graduation_date) : null,
        last_mistake_date: item.last_mistake_date ? new Date(item.last_mistake_date) : null,
        review_due: new Date(item.review_due),
        similar_character_confusions: typeof item.similar_character_confusions === 'object' 
          ? item.similar_character_confusions as Record<string, number>
          : {},
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
    } catch (error) {
      console.error('Error fetching enhanced character progress:', error);
      return [];
    }
  },

  // Calculate overall mastery statistics
  calculateMasteryStats: async (userId: string, kanaType?: 'hiragana' | 'katakana'): Promise<{
    total: number;
    new: number;
    learning: number;
    familiar: number;
    practiced: number;
    reliable: number;
    mastered: number;
    averageConfidence: number;
  }> => {
    try {
      let query = supabase
        .from('user_kana_progress')
        .select('mastery_level, confidence_score, character_id')
        .eq('user_id', userId);

      if (kanaType) {
        query = query.ilike('character_id', `${kanaType}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        new: 0,
        learning: 0,
        familiar: 0,
        practiced: 0,
        reliable: 0,
        mastered: 0,
        averageConfidence: 0
      };

      if (data && data.length > 0) {
        const confidenceSum = data.reduce((sum, item) => sum + (item.confidence_score || 0), 0);
        stats.averageConfidence = Math.round(confidenceSum / data.length);

        data.forEach(item => {
          switch (item.mastery_level) {
            case 0: stats.new++; break;
            case 1: stats.learning++; break;
            case 2: stats.familiar++; break;
            case 3: stats.practiced++; break;
            case 4: stats.reliable++; break;
            case 5: stats.mastered++; break;
          }
        });
      }

      return stats;
    } catch (error) {
      console.error('Error calculating mastery stats:', error);
      return {
        total: 0,
        new: 0,
        learning: 0,
        familiar: 0,
        practiced: 0,
        reliable: 0,
        mastered: 0,
        averageConfidence: 0
      };
    }
  }
};
