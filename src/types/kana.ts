
export type KanaType = 'hiragana' | 'katakana';

export interface KanaExample {
  word: string;
  romaji: string;
  meaning: string;
  reading?: string; // Add this to fix the errors in data files
}

export interface KanaCharacter {
  id: string;
  character: string;
  romaji: string;
  type: KanaType;
  stroke_count: number;
  stroke_order: string[];
  mnemonic?: string;
  sound_file?: string;
  examples?: KanaExample[];
  group?: string;
}

// Add the missing interfaces that were referenced in various files
export interface UserKanaProgress {
  id?: string;
  user_id: string;
  character_id: string;
  proficiency: number;
  practice_count: number;
  last_practiced?: Date;
  consecutive_correct: number;
  next_review?: Date;
  created_at?: Date;
  updated_at?: Date;
}

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

export interface KanaPracticeResult {
  id?: string;
  user_id: string;
  session_id?: string;
  date: Date;
  kana_type: KanaType | 'mixed';
  correct_count: number;
  incorrect_count: number;
  total_questions: number;
  accuracy: number;
  duration_seconds: number;
  created_at?: Date;
  details?: string; // JSON string with detailed results
}

export interface KanaLearningSession {
  id?: string;
  user_id: string;
  start_time: Date;
  end_time?: Date;
  duration_minutes?: number;
  kana_type: KanaType | 'mixed';
  characters_studied: number;
  created_at?: Date;
}

// Add other missing interfaces referenced in Dashboard and EditProfile
export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  learning_goal?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserSettings {
  id: string;
  user_id?: string;
  theme?: 'light' | 'dark' | 'system';
  font_size?: 'small' | 'medium' | 'large';
  show_romaji?: boolean;
  show_english?: boolean;
  quiz_speed?: 'slow' | 'medium' | 'fast';
  daily_goal?: number;
  notification_enabled?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
