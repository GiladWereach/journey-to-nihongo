/**
 * Auto-generated Event Type Definitions
 */

export interface TrackingEvents {
  'learning_path_section_clicked': {
    user_id: string;
    section_name: string;
    page_url?: string;
  };
  'setting_toggled': {
    user_id: string;
    setting_name: string;
    new_value: string;
    page_url?: string;
  };
  'logout_completed': {
    user_id: string;
    page_url?: string;
  };
  'achievements_page_viewed': {
    user_id: string;
    page_url?: string;
  };
  'practice_session_restarted': {
    user_id: string;
    practice_type: string;
    page_url?: string;
  };
  'kana_type_selected': {
    user_id: string;
    kana_type: string;
    page_url?: string;
  };
  'assessment_question_answered': {
    user_id: string;
    question_number: string;
    selected_answer: string;
    correct_answer: string;
    is_correct: string;
    page_url?: string;
  };
  'timed_challenge_question_answered': {
    user_id: string;
    challenge_type: string;
    question_number: string;
    selected_answer: string;
    is_correct: string;
    page_url?: string;
  };
  'profile_settings_updated': {
    user_id: string;
    setting_name: string;
    new_value: string;
    page_url?: string;
  };
  'password_reset_requested': {
    email: string;
    page_url?: string;
  };
  'navigation_link_clicked': {
    user_id: string;
    link_text: string;
    destination_path: string;
    page_url?: string;
  };
  'profile_navigated_to': {
    user_id: string;
    page_url?: string;
  };
  'dashboard_navigated_to': {
    user_id: string;
    page_url?: string;
  };
  'page_viewed': {
    page_path: string;
    page_title: string;
    user_id: string;
    learning_level: string;
    page_url?: string;
  };
  'timed_challenge_completed': {
    user_id: string;
    challenge_type: string;
    score: string;
    time_taken: string;
    page_url?: string;
  };
  'assessment_started': {
    user_id: string;
    page_url?: string;
  };
  'achievement_unlocked': {
    user_id: string;
    achievement_id: string;
    achievement_name: string;
    page_url?: string;
  };
  'login_completed': {
    user_id: string;
    login_method: string;
    page_url?: string;
  };
  'signup_completed': {
    user_id: string;
    signup_method: string;
    page_url?: string;
  };
  'password_reset_completed': {
    user_id: string;
    page_url?: string;
  };
  'timed_challenge_started': {
    user_id: string;
    challenge_type: string;
    page_url?: string;
  };
  'assessment_completed': {
    user_id: string;
    score: string;
    percentage: string;
    learning_level_assigned: string;
    page_url?: string;
  };
}

export type EventName = keyof TrackingEvents;
export type EventProperties<T extends EventName> = TrackingEvents[T];
