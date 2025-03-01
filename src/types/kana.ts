// Add or update types as needed to align with the database schema

export interface KanaCharacter {
  id: string;
  character: string;
  romaji: string;
  type: 'hiragana' | 'katakana';
  stroke_count: number; // Use snake_case to match database
  stroke_order: string[];
  mnemonic?: string;
  sound_file?: string;
  examples?: {
    word: string;
    reading?: string; // Make reading optional
    meaning: string;
    romaji: string; // Make romaji required
  }[];
  created_at?: string;
}

export interface KanaGroup {
  id: string;
  name: string;
  type: 'hiragana' | 'katakana';
  description?: string;
  characters?: string[]; // Array of character IDs
  created_at?: string;
}

export interface KanaGroupCharacter {
  id: string;
  group_id: string;
  character_id: string;
  sequence_order: number;
  created_at?: string;
}

export interface KanaLearningSession {
  id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  kana_type: string;
  characters_studied: string[];
  accuracy?: number;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserKanaProgress {
  id: string;
  user_id: string;
  character_id: string;
  proficiency: number;
  mistake_count: number;
  total_practice_count: number;
  last_practiced: Date;
  review_due: Date;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  username?: string;
  display_name?: string;
  full_name?: string;
  avatar_url?: string;
  learning_level?: string;
  learning_goal?: string;
  daily_goal_minutes?: number;
  created_at?: string;
  updated_at?: string;
}

export interface UserSettings {
  id: string;
  theme?: string;
  daily_goal?: number;
  reminder_time?: string;
  study_reminder?: boolean;
  preferred_study_time?: string;
  notifications_enabled?: boolean;
  display_furigana?: boolean;
  prior_knowledge?: string;
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

export type KanaType = 'hiragana' | 'katakana';

// Add interface for tracking practice results
export interface KanaPracticeResult {
  characterId: string;
  correct: boolean;
  timestamp: Date;
}

// Updated PracticeResult interface for KanaPracticeResults component
export interface PracticeResult {
  correct: number;
  incorrect: number;
  total: number;
  kanaType: KanaType | 'all';
  practiceType: 'recognition' | 'matching';
  accuracy: number;
  totalQuestions: number;
  correctAnswers: number;
  characterResults: Array<{
    character: string;
    correct: boolean;
  }>;
}
