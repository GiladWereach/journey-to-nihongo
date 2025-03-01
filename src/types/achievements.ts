
export interface Achievement {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  requirements: string;
  required_progress: number;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  current_progress: number;
  unlocked_at: string;
  earned_at: string;
  updated_at?: string;
  created_at?: string;
  achievement?: Achievement;
}
