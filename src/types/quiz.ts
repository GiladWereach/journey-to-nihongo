
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
}

export interface QuizCharacterSet {
  id: string;
  name: string;
  description?: string;
  type: KanaType;
  characters: QuizCharacter[];
  consonantGroup?: string;
  vowelGroup?: string;
}

export interface QuizSettings {
  showBasicOnly: boolean;
  showPreviouslyLearned: boolean;
  showTroubleCharacters: boolean;
  characterSize: 'small' | 'medium' | 'large';
  audioFeedback: boolean;
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

export interface Achievement {
  id: string;
  name: string;
  description: string;
  criteria: {
    type: 'streak' | 'correct_answers' | 'accuracy' | 'completion' | 'time';
    threshold: number;
    scope?: KanaType | 'all';
  };
  icon: string;
  unlocked: boolean;
  progress: number;
}
