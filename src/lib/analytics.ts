/**
 * Weave BI SDK Initialization
 *
 * Import this file in your app entry point:
 * import '@/lib/analytics';
 *
 * AUTO-TRACKED EVENTS (0):
 * 
 *
 * MANUAL EVENTS (59) - Use functions from analytics-generated.ts:
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
 * - all_courses_viewed
 * - alert_dialog_header_modal_opened
 * - alert_dialog_footer_modal_opened
 * - command_modal_opened
 * - command_search_performed
 * - command_shortcut_modal_opened
 * - command_shortcut_search_performed
 * - dialog_header_modal_opened
 * - dialog_footer_modal_opened
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
 * - assessment_dashboard_button_clicked
 * - assessment_answer_selected
 * - assessment_previous_button_clicked
 * - assessment_next_button_clicked
 * - assessment_completed
 * - assessment_failed
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
 * - quick_quiz_go_home_button_clicked
 * - quick_quiz_restart_button_clicked
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
  projectId: 'db2adbc5-db08-4425-8e21-7a4fd32c3a5d',
  apiEndpoint: 'https://dkvdjbxeacaitlbansni.supabase.co/functions/v1/ingest-events-v2',
  debug: process.env.NODE_ENV === 'development',
  autoPageViews: true,
  autoErrorTracking: true,
  autoClickTracking: true,
  autoFormTracking: true,
  events: []
});

console.log('[Weave BI] Analytics initialized for project: db2adbc5-db08-4425-8e21-7a4fd32c3a5d');
console.log('[Weave BI] Auto-tracking 0 events via event delegation');
console.log('[Weave BI] 59 events require manual implementation - see analytics-generated.ts');
