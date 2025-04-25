
export interface UserLearningProgress {
  id: string;
  user_id: string;
  current_stage: 'assessment' | 'hiragana' | 'katakana' | 'kanji';
  assessment_completed: boolean;
  hiragana_completed: boolean;
  katakana_completed: boolean;
  assessment_completed_at: string | null;
  created_at: string;
  updated_at: string;
}
