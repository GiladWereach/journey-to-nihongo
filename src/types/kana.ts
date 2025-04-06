
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

// Updated UserKanaProgress interface to match how it's used in the codebase
export interface UserKanaProgress {
  id?: string;
  user_id: string;
  character_id: string;
  proficiency: number;
  total_practice_count: number; // Changed from practice_count
  mistake_count: number; // Added this field
  last_practiced: Date;
  consecutive_correct: number;
  mastery_level: number; // Added this field
  review_due: Date; // Changed from next_review
  created_at?: Date | string; // Allow both Date and string
  updated_at?: Date | string; // Allow both Date and string
}

// Updated to include characterId and correct fields used in the codebase
export interface KanaPracticeResult {
  id?: string;
  user_id: string;
  session_id?: string;
  date: Date | string; // Allow both Date and string
  kana_type: KanaType | 'mixed';
  correct_count: number;
  incorrect_count: number;
  total_questions: number;
  accuracy: number;
  duration_seconds: number;
  created_at?: Date | string; // Allow both Date and string
  details?: string; // JSON string with detailed results
  characterId?: string; // Added this field
  correct?: boolean; // Added this field
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

export interface KanaLearningSession {
  id?: string;
  user_id: string;
  start_time: Date | string; // Allow both Date and string
  end_time?: Date | string; // Allow both Date and string
  duration_minutes?: number;
  kana_type: KanaType | 'mixed';
  characters_studied: number;
  created_at?: Date | string; // Allow both Date and string
}

// Update Profile interface to match what's being used in Dashboard.tsx
export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  learning_goal?: string;
  full_name?: string; // Added this field
  learning_level?: string; // Added this field
  daily_goal_minutes?: number; // Added this field
  created_at?: Date | string; // Allow both Date and string
  updated_at?: Date | string; // Allow both Date and string
}

// Update UserSettings interface to match what's being used
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
  prior_knowledge?: string; // Added this field
  display_furigana?: boolean; // Added this field
  notifications_enabled?: boolean; // Added this field
  preferred_study_time?: string; // Added this field
  reminder_time?: string; // Added this field
  study_reminder?: boolean; // Added this field
  created_at?: Date | string; // Allow both Date and string
  updated_at?: Date | string; // Allow both Date and string
}
