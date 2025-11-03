/**
 * Weave BI SDK Initialization
 *
 * Import this file in your app entry point:
 * import '@/lib/analytics';
 *
 * AUTO-TRACKED EVENTS (0):
 * 
 *
 * MANUAL EVENTS (39) - Use functions from analytics-generated.ts:
 * - page_viewed
 * - dashboard_link_clicked
 * - assessment_started
 * - assessment_answer_selected
 * - assessment_next_question_clicked
 * - assessment_previous_question_clicked
 * - assessment_completed
 * - assessment_failed
 * - assessment_dashboard_button_clicked
 * - login_attempted
 * - login_completed
 * - login_failed
 * - signup_attempted
 * - signup_completed
 * - signup_failed
 * - profile_edit_cancelled
 * - setting_display_furigana_toggled
 * - setting_quiz_auto_advance_toggled
 * - setting_show_stroke_order_toggled
 * - profile_settings_saved
 * - profile_settings_save_failed
 * - quick_quiz_home_button_clicked
 * - quick_quiz_restart_button_clicked
 * - password_reset_requested
 * - password_reset_failed
 * - timed_challenge_auth_redirect_clicked
 * - timed_challenge_dashboard_redirect_clicked
 * - timed_challenge_type_selected
 * - timed_challenge_game_started
 * - timed_challenge_answer_submitted
 * - timed_challenge_game_reset
 * - writing_practice_progress_redirect_clicked
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
  projectId: 'a9c87ad3-d203-408f-ae6f-7a0b44db9c9b',
  apiEndpoint: 'https://dkvdjbxeacaitlbansni.supabase.co/functions/v1/ingest-events-v2',
  debug: process.env.NODE_ENV === 'development',
  autoPageViews: true,
  autoErrorTracking: true,
  autoClickTracking: true,
  autoFormTracking: true,
  events: []
});

console.log('[Weave BI] Analytics initialized for project: a9c87ad3-d203-408f-ae6f-7a0b44db9c9b');
console.log('[Weave BI] Auto-tracking 0 events via event delegation');
console.log('[Weave BI] 39 events require manual implementation - see analytics-generated.ts');
