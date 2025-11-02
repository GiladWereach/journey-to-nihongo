/**
 * Weave BI SDK Initialization
 *
 * Import this file in your app entry point:
 * import '@/lib/analytics';
 *
 * AUTO-TRACKED EVENTS (0):
 * 
 *
 * MANUAL EVENTS (49) - Use functions from analytics-generated.ts:
 * - page_viewed
 * - achievements_page_viewed
 * - assessment_page_viewed
 * - auth_page_viewed
 * - dashboard_page_viewed
 * - edit_profile_page_viewed
 * - index_page_viewed
 * - kana_learning_page_viewed
 * - learn_page_viewed
 * - not_found_page_viewed
 * - practice_page_viewed
 * - profile_page_viewed
 * - progress_page_viewed
 * - quick_quiz_page_viewed
 * - quiz_page_viewed
 * - reset_password_page_viewed
 * - timed_challenge_page_viewed
 * - writing_practice_page_viewed
 * - dashboard_link_clicked
 * - assessment_started
 * - assessment_question_answered
 * - assessment_next_question_clicked
 * - assessment_previous_question_clicked
 * - assessment_completed
 * - assessment_failed
 * - login_attempted
 * - login_completed
 * - login_failed
 * - signup_attempted
 * - signup_completed
 * - signup_failed
 * - profile_settings_updated
 * - display_furigana_toggled
 * - quiz_auto_advance_toggled
 * - show_stroke_order_toggled
 * - quick_quiz_restarted
 * - password_reset_requested
 * - password_reset_failed
 * - timed_challenge_type_selected
 * - timed_challenge_started
 * - timed_challenge_answer_submitted
 * - timed_challenge_restarted
 * - abandoned_sessions_fixed
 * - learning_path_navigated
 * - courses_page_navigated
 * - alert_dialog_opened
 * - command_dialog_opened
 * - command_search_performed
 * - dialog_opened
 *
 * The SDK automatically tracks:
 * - Page views (route changes)
 * - Errors (unhandled exceptions)
 * - Clicks (via CSS selectors)
 * - Form submissions (via CSS selectors)
 */

import { init } from './weave-bi';

// Initialize Weave BI with auto-tracking
init({
  projectId: 'ffcbd925-0a60-45f1-9324-9f21f1fd41d4',
  apiEndpoint: 'https://dkvdjbxeacaitlbansni.supabase.co/functions/v1/ingest-events-v2',
  debug: process.env.NODE_ENV === 'development',
  autoPageViews: true,
  autoErrorTracking: true,
  autoClickTracking: true,
  autoFormTracking: true,
  events: []
});

console.log('[Weave BI] Analytics initialized for project: ffcbd925-0a60-45f1-9324-9f21f1fd41d4');
console.log('[Weave BI] Auto-tracking 0 events via event delegation');
console.log('[Weave BI] 49 events require manual implementation - see analytics-generated.ts');
