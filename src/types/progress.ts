
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

export type LearningStage = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  progress: number;
  features?: Array<{
    name: string;
    description: string;
    icon: string;
    available: boolean;
  }>;
};
