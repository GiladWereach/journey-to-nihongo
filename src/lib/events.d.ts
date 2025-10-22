/**
 * Auto-generated Event Type Definitions
 */

export interface TrackingEvents {
  'quick_quiz_restarted': {
    user_id: string;
    page_url?: string;
  };
  'edit_profile_saved': {
    user_id: string;
    settings_changed: string;
    page_url?: string;
  };
  'assessment_question_answered': {
    user_id: string;
    question_number: string;
    answer_selected: string;
    correct_answer_given: string;
    page_url?: string;
  };
  'timed_challenge_reset': {
    user_id: string;
    page_url?: string;
  };
  'progress_page_viewed': {
    user_id: string;
    page_url?: string;
  };
  'quiz_page_viewed': {
    user_id: string;
    page_url?: string;
  };
  'learn_page_viewed': {
    user_id: string;
    page_url?: string;
  };
  'kana_learning_page_viewed': {
    user_id: string;
    kana_type: string;
    page_url?: string;
  };
  'achievements_page_viewed': {
    user_id: string;
    page_url?: string;
  };
  'timed_challenge_answer_submitted': {
    user_id: string;
    answer: string;
    is_correct: string;
    page_url?: string;
  };
  'home_page_viewed': {
    user_id: string;
    page_url?: string;
  };
  'auth_page_viewed': {
    user_id: string;
    page_url?: string;
  };
  'password_reset_requested': {
    email_used: string;
    page_url?: string;
  };
  'page_viewed': {
    page_name: string;
    user_id: string;
    page_url?: string;
  };
  'edit_profile_page_viewed': {
    user_id: string;
    page_url?: string;
  };
  'profile_page_viewed': {
    user_id: string;
    page_url?: string;
  };
  'assessment_navigated_back': {
    user_id: string;
    current_question: string;
    page_url?: string;
  };
  'setting_display_furigana_toggled': {
    user_id: string;
    new_value: string;
    page_url?: string;
  };
  'setting_quiz_auto_advance_toggled': {
    user_id: string;
    new_value: string;
    page_url?: string;
  };
  'setting_show_stroke_order_toggled': {
    user_id: string;
    new_value: string;
    page_url?: string;
  };
  'button_clicked': {
    button_text: string;
    page_name: string;
    page_url?: string;
  };
  'dashboard_page_viewed': {
    user_id: string;
    learning_level: string;
    page_url?: string;
  };
  'signup_submitted': {
    user_id: string;
    email_used: string;
    page_url?: string;
  };
  'assessment_completed': {
    user_id: string;
    score: string;
    percentage: string;
    learning_level_assigned: string;
    page_url?: string;
  };
  'login_submitted': {
    user_id: string;
    email_used: string;
    page_url?: string;
  };
  'assessment_started': {
    user_id: string;
    page_url?: string;
  };
  'timed_challenge_started': {
    user_id: string;
    kana_type_selected: string;
    page_url?: string;
  };
  'assessment_page_viewed': {
    user_id: string;
    page_url?: string;
  };
}

export type EventName = keyof TrackingEvents;
export type EventProperties<T extends EventName> = TrackingEvents[T];
