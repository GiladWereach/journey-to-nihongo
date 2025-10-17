/**
 * Auto-generated Event Type Definitions
 */

export interface TrackingEvents {
  'search_performed': {
    undefined: string;
    undefined: string;
    page_url?: string;
  };
  'quiz_started': {
    undefined: string;
    undefined: string;
    page_url?: string;
  };
  'premium_feature_accessed': {
    undefined: string;
    page_url?: string;
  };
  'achievement_unlocked': {
    undefined: string;
    page_url?: string;
  };
  'lesson_started': {
    undefined: string;
    undefined: string;
    page_url?: string;
  };
  'feedback_submitted': {
    undefined: string;
    undefined: string;
    page_url?: string;
  };
  'flashcard_deck_accessed': {
    undefined: string;
    undefined: string;
    page_url?: string;
  };
  'flashcard_studied': {
    undefined: string;
    undefined: string;
    undefined: string;
    page_url?: string;
  };
  'streak_maintained': {
    undefined: string;
    page_url?: string;
  };
  'signup_started': {
    undefined: string;
    page_url?: string;
  };
  'content_shared': {
    undefined: string;
    undefined: string;
    undefined: string;
    page_url?: string;
  };
  'ad_viewed': {
    undefined: string;
    undefined: string;
    page_url?: string;
  };
  'logout_completed': {
    undefined: string;
    page_url?: string;
  };
  'profile_updated': {
    undefined: string;
    undefined: string;
    page_url?: string;
  };
  'settings_updated': {
    undefined: string;
    undefined: string;
    undefined: string;
    page_url?: string;
  };
  'page_viewed': {
    undefined: string;
    undefined: string;
    undefined: string;
    page_url?: string;
  };
  'signup_completed': {
    undefined: string;
    undefined: string;
    page_url?: string;
  };
  'lesson_completed': {
    undefined: string;
    page_url?: string;
  };
  'quiz_completed': {
    undefined: string;
    undefined: string;
    undefined: string;
    page_url?: string;
  };
  'question_answered': {
    undefined: string;
    undefined: string;
    undefined: string;
    undefined: string;
    page_url?: string;
  };
  'subscription_started': {
    undefined: string;
    undefined: string;
    undefined: string;
    page_url?: string;
  };
  'subscription_renewed': {
    undefined: string;
    undefined: string;
    undefined: string;
    page_url?: string;
  };
  'subscription_cancelled': {
    undefined: string;
    page_url?: string;
  };
  'purchase_made': {
    undefined: string;
    undefined: string;
    undefined: string;
    page_url?: string;
  };
  'login_successful': {
    undefined: string;
    undefined: string;
    page_url?: string;
  };
}

export type EventName = keyof TrackingEvents;
export type EventProperties<T extends EventName> = TrackingEvents[T];
