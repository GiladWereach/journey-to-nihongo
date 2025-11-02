/**
 * Weave BI Tracking Functions
 * Auto-generated - DO NOT EDIT
 *
 * Generated at: 2025-11-02T17:46:13.011Z
 * Total events: 59
 * - Auto-tracked: 0 (clicks, forms, page views)
 * - Manual implementation: 59 (business logic events)
 *
 * USAGE:
 *
 * 1. AUTO-TRACKED EVENTS (0):
 *    These fire automatically when users interact with your app.
 *    No code needed - just import '@/lib/analytics' in your app entry point.
 *    
 *
 * 2. MANUAL EVENTS (59):
 *    Call these functions in your business logic:
 *    - password_reset_requested
 *    - password_reset_failed
 *    - timed_challenge_auth_redirect_clicked
 *    ... and 56 more
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
 * Track: all_courses_viewed
 */
export const allCoursesViewed = () => track('all_courses_viewed');

/**
 * Track: alert_dialog_header_modal_opened
 */
export const alertDialogHeaderModalOpened = () => track('alert_dialog_header_modal_opened');

/**
 * Track: alert_dialog_footer_modal_opened
 */
export const alertDialogFooterModalOpened = () => track('alert_dialog_footer_modal_opened');

/**
 * Track: command_modal_opened
 */
export const commandModalOpened = () => track('command_modal_opened');

/**
 * Track: command_search_performed
 */
export const commandSearchPerformed = () => track('command_search_performed');

/**
 * Track: command_shortcut_modal_opened
 */
export const commandShortcutModalOpened = () => track('command_shortcut_modal_opened');

/**
 * Track: command_shortcut_search_performed
 */
export const commandShortcutSearchPerformed = () => track('command_shortcut_search_performed');

/**
 * Track: dialog_header_modal_opened
 */
export const dialogHeaderModalOpened = () => track('dialog_header_modal_opened');

/**
 * Track: dialog_footer_modal_opened
 */
export const dialogFooterModalOpened = () => track('dialog_footer_modal_opened');

/**
 * Track: page_viewed
 */
export const pageViewed = () => track('page_viewed');

/**
 * Track: achievements_page_viewed
 */
export const achievementsPageViewed = () => track('achievements_page_viewed');

/**
 * Track: assessment_page_viewed
 */
export const assessmentPageViewed = () => track('assessment_page_viewed');

/**
 * Track: auth_page_viewed
 */
export const authPageViewed = () => track('auth_page_viewed');

/**
 * Track: dashboard_page_viewed
 */
export const dashboardPageViewed = () => track('dashboard_page_viewed');

/**
 * Track: edit_profile_page_viewed
 */
export const editProfilePageViewed = () => track('edit_profile_page_viewed');

/**
 * Track: index_page_viewed
 */
export const indexPageViewed = () => track('index_page_viewed');

/**
 * Track: kana_learning_page_viewed
 */
export const kanaLearningPageViewed = () => track('kana_learning_page_viewed');

/**
 * Track: learn_page_viewed
 */
export const learnPageViewed = () => track('learn_page_viewed');

/**
 * Track: not_found_page_viewed
 */
export const notFoundPageViewed = () => track('not_found_page_viewed');

/**
 * Track: practice_page_viewed
 */
export const practicePageViewed = () => track('practice_page_viewed');

/**
 * Track: profile_page_viewed
 */
export const profilePageViewed = () => track('profile_page_viewed');

/**
 * Track: progress_page_viewed
 */
export const progressPageViewed = () => track('progress_page_viewed');

/**
 * Track: quick_quiz_page_viewed
 */
export const quickQuizPageViewed = () => track('quick_quiz_page_viewed');

/**
 * Track: quiz_page_viewed
 */
export const quizPageViewed = () => track('quiz_page_viewed');

/**
 * Track: reset_password_page_viewed
 */
export const resetPasswordPageViewed = () => track('reset_password_page_viewed');

/**
 * Track: timed_challenge_page_viewed
 */
export const timedChallengePageViewed = () => track('timed_challenge_page_viewed');

/**
 * Track: writing_practice_page_viewed
 */
export const writingPracticePageViewed = () => track('writing_practice_page_viewed');

/**
 * Track: dashboard_link_clicked
 */
export const dashboardLinkClicked = () => track('dashboard_link_clicked');

/**
 * Track: assessment_dashboard_button_clicked
 */
export const assessmentDashboardButtonClicked = () => track('assessment_dashboard_button_clicked');

/**
 * Track: assessment_answer_selected
 */
export const assessmentAnswerSelected = () => track('assessment_answer_selected');

/**
 * Track: assessment_previous_button_clicked
 */
export const assessmentPreviousButtonClicked = () => track('assessment_previous_button_clicked');

/**
 * Track: assessment_next_button_clicked
 */
export const assessmentNextButtonClicked = () => track('assessment_next_button_clicked');

/**
 * Track: assessment_completed
 */
export const assessmentCompleted = () => track('assessment_completed');

/**
 * Track: assessment_failed
 */
export const assessmentFailed = () => track('assessment_failed');

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
 * Track: quick_quiz_go_home_button_clicked
 */
export const quickQuizGoHomeButtonClicked = () => track('quick_quiz_go_home_button_clicked');

/**
 * Track: quick_quiz_restart_button_clicked
 */
export const quickQuizRestartButtonClicked = () => track('quick_quiz_restart_button_clicked');

/**
 * All analytics tracking functions
 */
export const analytics = {
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
  allCoursesViewed,
  alertDialogHeaderModalOpened,
  alertDialogFooterModalOpened,
  commandModalOpened,
  commandSearchPerformed,
  commandShortcutModalOpened,
  commandShortcutSearchPerformed,
  dialogHeaderModalOpened,
  dialogFooterModalOpened,
  pageViewed,
  achievementsPageViewed,
  assessmentPageViewed,
  authPageViewed,
  dashboardPageViewed,
  editProfilePageViewed,
  indexPageViewed,
  kanaLearningPageViewed,
  learnPageViewed,
  notFoundPageViewed,
  practicePageViewed,
  profilePageViewed,
  progressPageViewed,
  quickQuizPageViewed,
  quizPageViewed,
  resetPasswordPageViewed,
  timedChallengePageViewed,
  writingPracticePageViewed,
  dashboardLinkClicked,
  assessmentDashboardButtonClicked,
  assessmentAnswerSelected,
  assessmentPreviousButtonClicked,
  assessmentNextButtonClicked,
  assessmentCompleted,
  assessmentFailed,
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
  quickQuizGoHomeButtonClicked,
  quickQuizRestartButtonClicked,
};
