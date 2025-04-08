
export interface StudySession {
  id: string;
  user_id: string;
  module: string;
  topics: string[];
  duration_minutes: number;
  session_date: string;
  completed: boolean;
  performance_score?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ContinueLearningData {
  title: string;
  description: string;
  progress: number;
  route: string;
  japaneseTitle?: string;
  lastActive?: string;
}
