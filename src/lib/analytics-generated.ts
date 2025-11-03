/**
 * Weave BI Tracking Functions
 * Auto-generated - DO NOT EDIT
 *
 * Generated at: 2025-11-03T11:54:00.312Z
 * Total events: 39
 * - Auto-tracked: 0 (clicks, forms, page views)
 * - Manual implementation: 39 (business logic events)
 *
 * USAGE:
 *
 * 1. AUTO-TRACKED EVENTS (0):
 *    These fire automatically when users interact with your app.
 *    No code needed - just import '@/lib/analytics' in your app entry point.
 *    
 *
 * 2. MANUAL EVENTS (39):
 *    Call these functions in your business logic:
 *    - page_viewed
 *    - dashboard_link_clicked
 *    - assessment_started
 *    ... and 36 more
 *
 *    Example:
 *    import { purchaseCompleted } from '@/lib/analytics-generated';
 *
 *    async function checkout() {
 *      const result = await processPayment();
 *      if (result.success) {
 *        purchaseCompleted({ amount: result.amount, currency: 'USD' });
 *      }
 *    }
 */

import { track } from './weave-bi';

/**
 * Track: page_viewed
 */
export const pageViewed = () => track('page_viewed');

/**
 * Track: dashboard_link_clicked
 */
export const dashboardLinkClicked = () => track('dashboard_link_clicked');

/**
 * Track: assessment_started
 */
export const assessmentStarted = () => track('assessment_started');

/**
 * Track: assessment_answer_selected
 */
export const assessmentAnswerSelected = () => track('assessment_answer_selected');

/**
 * Track: assessment_next_question_clicked
 */
export const assessmentNextQuestionClicked = () => track('assessment_next_question_clicked');

/**
 * Track: assessment_previous_question_clicked
 */
export const assessmentPreviousQuestionClicked = () => track('assessment_previous_question_clicked');

/**
 * Track: assessment_completed
 */
export const assessmentCompleted = () => track('assessment_completed');

/**
 * Track: assessment_failed
 */
export const assessmentFailed = () => track('assessment_failed');

/**
 * Track: assessment_dashboard_button_clicked
 */
export const assessmentDashboardButtonClicked = () => track('assessment_dashboard_button_clicked');

/**
 * Track: login_attempted
 */
export const loginAttempted = () => track('login_attempted');

/**
 * Track: login_completed
 */
export const loginCompleted = () => track('login_completed');

/**
 * Track: login_failed
 */
export const loginFailed = () => track('login_failed');

/**
 * Track: signup_attempted
 */
export const signupAttempted = () => track('signup_attempted');

/**
 * Track: signup_completed
 */
export const signupCompleted = () => track('signup_completed');

/**
 * Track: signup_failed
 */
export const signupFailed = () => track('signup_failed');

/**
 * Track: profile_edit_cancelled
 */
export const profileEditCancelled = () => track('profile_edit_cancelled');

/**
 * Track: setting_display_furigana_toggled
 */
export const settingDisplayFuriganaToggled = () => track('setting_display_furigana_toggled');

/**
 * Track: setting_quiz_auto_advance_toggled
 */
export const settingQuizAutoAdvanceToggled = () => track('setting_quiz_auto_advance_toggled');

/**
 * Track: setting_show_stroke_order_toggled
 */
export const settingShowStrokeOrderToggled = () => track('setting_show_stroke_order_toggled');

/**
 * Track: profile_settings_saved
 */
export const profileSettingsSaved = () => track('profile_settings_saved');

/**
 * Track: profile_settings_save_failed
 */
export const profileSettingsSaveFailed = () => track('profile_settings_save_failed');

/**
 * Track: quick_quiz_home_button_clicked
 */
export const quickQuizHomeButtonClicked = () => track('quick_quiz_home_button_clicked');

/**
 * Track: quick_quiz_restart_button_clicked
 */
export const quickQuizRestartButtonClicked = () => track('quick_quiz_restart_button_clicked');

/**
 * Track: password_reset_requested
 */
export const passwordResetRequested = () => track('password_reset_requested');

/**
 * Track: password_reset_failed
 */
export const passwordResetFailed = () => track('password_reset_failed');

/**
 * Track: timed_challenge_auth_redirect_clicked
 */
export const timedChallengeAuthRedirectClicked = () => track('timed_challenge_auth_redirect_clicked');

/**
 * Track: timed_challenge_dashboard_redirect_clicked
 */
export const timedChallengeDashboardRedirectClicked = () => track('timed_challenge_dashboard_redirect_clicked');

/**
 * Track: timed_challenge_type_selected
 */
export const timedChallengeTypeSelected = () => track('timed_challenge_type_selected');

/**
 * Track: timed_challenge_game_started
 */
export const timedChallengeGameStarted = () => track('timed_challenge_game_started');

/**
 * Track: timed_challenge_answer_submitted
 */
export const timedChallengeAnswerSubmitted = () => track('timed_challenge_answer_submitted');

/**
 * Track: timed_challenge_game_reset
 */
export const timedChallengeGameReset = () => track('timed_challenge_game_reset');

/**
 * Track: writing_practice_progress_redirect_clicked
 */
export const writingPracticeProgressRedirectClicked = () => track('writing_practice_progress_redirect_clicked');

/**
 * Track: abandoned_sessions_fixed
 */
export const abandonedSessionsFixed = () => track('abandoned_sessions_fixed');

/**
 * Track: learning_path_navigated
 */
export const learningPathNavigated = () => track('learning_path_navigated');

/**
 * Track: courses_page_navigated
 */
export const coursesPageNavigated = () => track('courses_page_navigated');

/**
 * Track: alert_dialog_opened
 */
export const alertDialogOpened = () => track('alert_dialog_opened');

/**
 * Track: command_dialog_opened
 */
export const commandDialogOpened = () => track('command_dialog_opened');

/**
 * Track: command_search_performed
 */
export const commandSearchPerformed = () => track('command_search_performed');

/**
 * Track: dialog_opened
 */
export const dialogOpened = () => track('dialog_opened');

/**
 * All analytics tracking functions
 */
export const analytics = {
  pageViewed,
  dashboardLinkClicked,
  assessmentStarted,
  assessmentAnswerSelected,
  assessmentNextQuestionClicked,
  assessmentPreviousQuestionClicked,
  assessmentCompleted,
  assessmentFailed,
  assessmentDashboardButtonClicked,
  loginAttempted,
  loginCompleted,
  loginFailed,
  signupAttempted,
  signupCompleted,
  signupFailed,
  profileEditCancelled,
  settingDisplayFuriganaToggled,
  settingQuizAutoAdvanceToggled,
  settingShowStrokeOrderToggled,
  profileSettingsSaved,
  profileSettingsSaveFailed,
  quickQuizHomeButtonClicked,
  quickQuizRestartButtonClicked,
  passwordResetRequested,
  passwordResetFailed,
  timedChallengeAuthRedirectClicked,
  timedChallengeDashboardRedirectClicked,
  timedChallengeTypeSelected,
  timedChallengeGameStarted,
  timedChallengeAnswerSubmitted,
  timedChallengeGameReset,
  writingPracticeProgressRedirectClicked,
  abandonedSessionsFixed,
  learningPathNavigated,
  coursesPageNavigated,
  alertDialogOpened,
  commandDialogOpened,
  commandSearchPerformed,
  dialogOpened,
};
