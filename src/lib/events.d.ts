/**
 * Auto-generated Event Type Definitions
 */

export interface TrackingEvents {
  'password_reset_requested': {
    email: string;
    page_url?: string;
  };
  'timed_challenge_started': {
    user_id: string;
    kana_type: string;
    difficulty: string;
    time_limit_seconds: string;
    page_url?: string;
  };
  'profile_updated': {
    user_id: string;
    updated_fields: string;
    page_url?: string;
  };
  'writing_practice_started': {
    user_id: string;
    kana_type: string;
    page_url?: string;
  };
  'writing_practice_completed': {
    user_id: string;
    kana_type: string;
    duration_seconds: string;
    characters_practiced: string;
    page_url?: string;
  };
  'logout_completed': {
    user_id: string;
    page_url?: string;
  };
  'learning_path_card_clicked': {
    user_id: string;
    path_title: string;
    page_destination: string;
    page_url?: string;
  };
  'kana_mastery_level_changed': {
    user_id: string;
    character_id: string;
    kana: string;
    romaji: string;
    previous_mastery_level: string;
    new_mastery_level: string;
    page_url?: string;
  };
  'quiz_session_started': {
    user_id: string;
    session_id: string;
    kana_type: string;
    page_url?: string;
  };
  'signup_completed': {
    user_id: string;
    email: string;
    signup_method: string;
    page_url?: string;
  };
  'login_completed': {
    user_id: string;
    email: string;
    login_method: string;
    page_url?: string;
  };
  'assessment_completed': {
    user_id: string;
    score: string;
    percentage: string;
    determined_learning_level: string;
    page_url?: string;
  };
  'page_viewed': {
    page_name: string;
    user_id: string;
    page_url?: string;
  };
  'quiz_session_ended': {
    user_id: string;
    session_id: string;
    kana_type: string;
    questions_attempted: string;
    correct_answers: string;
    accuracy: string;
    session_duration_seconds: string;
    page_url?: string;
  };
  'timed_challenge_completed': {
    user_id: string;
    kana_type: string;
    difficulty: string;
    score: string;
    time_remaining_seconds: string;
    accuracy: string;
    total_questions: string;
    page_url?: string;
  };
}

export type EventName = keyof TrackingEvents;
export type EventProperties<T extends EventName> = TrackingEvents[T];
