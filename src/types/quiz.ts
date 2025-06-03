
import { KanaCharacter } from './kana';

export type KanaType = 'hiragana' | 'katakana';

export interface QuizCharacter {
  id: string;
  character: string;
  romaji: string;
  type: KanaType;
  isDakuten?: boolean;
  isHandakuten?: boolean;
  group?: string;
  row?: string;
  quizMode?: 'recognition' | 'production' | 'both';
}

export interface QuizSession {
  id: string;
  user_id: string;
  kana_type: KanaType;
  questions_answered: number;
  correct_answers: number;
  accuracy: number;
  streak: number;
  start_time: string;
  end_time?: string;
  completed: boolean;
}

export interface CharacterProgress {
  id: string;
  user_id: string;
  character_id: string;
  proficiency: number;
  mistake_count: number;
  total_practice_count: number;
  consecutive_correct: number;
  last_practiced: string;
  review_due: string;
  mastery_level: number;
}

export interface QuizSettings {
  showBasicOnly: boolean;
  showPreviouslyLearned: boolean;
  showTroubleCharacters: boolean;
  characterSize: 'small' | 'medium' | 'large';
  audioFeedback: boolean;
  speedMode?: boolean;
  includeDakuten?: boolean;
  includeHandakuten?: boolean;
}

export interface CharacterResult {
  characterId: string;
  character: string;
  romaji: string;
  isCorrect: boolean;
  attemptCount: number;
}

export interface QuizSessionStats {
  startTime: Date;
  endTime: Date | null;
  totalAttempts: number;
  correctCount: number;
  incorrectCount: number;
  currentStreak: number;
  longestStreak: number;
  accuracy: number;
  durationSeconds?: number;
  characterResults: CharacterResult[];
}
