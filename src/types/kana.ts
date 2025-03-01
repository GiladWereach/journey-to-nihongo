
export type KanaType = 'hiragana' | 'katakana';
export type StrokeDirection = 'horizontal' | 'vertical' | 'diagonal' | 'curve';

export interface KanaCharacter {
  id: string;
  character: string;
  romaji: string;
  type: KanaType;
  strokeCount: number;
  strokeOrder: string[];
  soundFile?: string;
  mnemonic?: string;
  examples?: {
    word: string;
    romaji: string;
    meaning: string;
  }[];
}

export interface KanaGroup {
  id: string;
  name: string;
  characters: KanaCharacter[];
  type?: KanaType;
}

export interface UserKanaProgress {
  userId: string;
  characterId: string;
  proficiency: number; // 0-100
  lastPracticed: Date;
  reviewDue: Date;
  mistakeCount: number;
  totalPracticeCount: number;
}

export interface KanaLearningSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  kanaType: KanaType;
  charactersStudied: string[]; // character IDs
  accuracy: number; // 0-100
  completed: boolean;
}

// Database-aligned types
export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  full_name?: string;
  learning_level?: string;
  learning_goal?: string;
  daily_goal_minutes?: number;
  created_at?: string;
  updated_at?: string;
}

export interface UserSettings {
  id: string;
  theme?: string;
  study_reminder?: boolean;
  reminder_time?: string;
  daily_goal?: number;
  prior_knowledge?: string;
  preferred_study_time?: string;
  notifications_enabled?: boolean;
  display_furigana?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  module: string;
  topics: string[];
  duration_minutes: number;
  session_date: string;
  completed: boolean;
  performance_score?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}
