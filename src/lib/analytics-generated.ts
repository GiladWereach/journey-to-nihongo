/**
 * Weave BI Tracking
 * Auto-generated - DO NOT EDIT
 *
 * Generated at: 2025-11-01T19:52:00.031Z
 * Total events: 74
 */

import { track } from './weave-bi';

/**
 * Track: profile_settings_saved
 */
export const profileSettingsSaved = () => track('profile_settings_saved');

/**
 * Track: page_viewed
 */
export const pageViewed = () => track('page_viewed');

/**
 * Track: signup_form_submitted
 */
export const signupFormSubmitted = () => track('signup_form_submitted');

/**
 * Track: login_form_submitted
 */
export const loginFormSubmitted = () => track('login_form_submitted');

/**
 * Track: password_reset_requested
 */
export const passwordResetRequested = () => track('password_reset_requested');

/**
 * Track: assessment_started
 */
export const assessmentStarted = () => track('assessment_started');

/**
 * Track: assessment_question_answered
 */
export const assessmentQuestionAnswered = () => track('assessment_question_answered');

/**
 * Track: assessment_completed
 */
export const assessmentCompleted = () => track('assessment_completed');

/**
 * Track: assessment_failed
 */
export const assessmentFailed = () => track('assessment_failed');

/**
 * Track: profile_settings_updated
 */
export const profileSettingsUpdated = () => track('profile_settings_updated');

/**
 * Track: display_furigana_toggled
 */
export const displayFuriganaToggled = () => track('display_furigana_toggled');

/**
 * Track: quiz_auto_advance_toggled
 */
export const quizAutoAdvanceToggled = () => track('quiz_auto_advance_toggled');

/**
 * Track: show_stroke_order_toggled
 */
export const showStrokeOrderToggled = () => track('show_stroke_order_toggled');

/**
 * Track: quick_quiz_started
 */
export const quickQuizStarted = () => track('quick_quiz_started');

/**
 * Track: quick_quiz_restarted
 */
export const quickQuizRestarted = () => track('quick_quiz_restarted');

/**
 * Track: timed_challenge_started
 */
export const timedChallengeStarted = () => track('timed_challenge_started');

/**
 * Track: timed_challenge_answer_submitted
 */
export const timedChallengeAnswerSubmitted = () => track('timed_challenge_answer_submitted');

/**
 * Track: timed_challenge_restarted
 */
export const timedChallengeRestarted = () => track('timed_challenge_restarted');

/**
 * Track: writing_practice_started
 */
export const writingPracticeStarted = () => track('writing_practice_started');

/**
 * Track: learning_path_navigated
 */
export const learningPathNavigated = () => track('learning_path_navigated');

/**
 * Track: courses_page_viewed
 */
export const coursesPageViewed = () => track('courses_page_viewed');

/**
 * Track: modal_opened
 */
export const modalOpened = () => track('modal_opened');

/**
 * Track: command_dialog_opened
 */
export const commandDialogOpened = () => track('command_dialog_opened');

/**
 * Track: command_search_performed
 */
export const commandSearchPerformed = () => track('command_search_performed');

/**
 * Track: achievement_viewed
 */
export const achievementViewed = () => track('achievement_viewed');

/**
 * Track: achievement_earned
 */
export const achievementEarned = () => track('achievement_earned');

/**
 * Track: abandoned_sessions_fixed
 */
export const abandonedSessionsFixed = () => track('abandoned_sessions_fixed');

/**
 * Track: quick_quiz_action_clicked
 */
export const quickQuizActionClicked = () => track('quick_quiz_action_clicked');

/**
 * Track: form_submitted
 */
export const formSubmitted = () => track('form_submitted');

/**
 * Track: password_reset_failed
 */
export const passwordResetFailed = () => track('password_reset_failed');

/**
 * Track: timed_challenge_navigation_clicked
 */
export const timedChallengeNavigationClicked = () => track('timed_challenge_navigation_clicked');

/**
 * Track: timed_challenge_type_selected
 */
export const timedChallengeTypeSelected = () => track('timed_challenge_type_selected');

/**
 * Track: link_clicked
 */
export const linkClicked = () => track('link_clicked');

/**
 * Track: assessment_navigation_clicked
 */
export const assessmentNavigationClicked = () => track('assessment_navigation_clicked');

/**
 * Track: assessment_answer_selected
 */
export const assessmentAnswerSelected = () => track('assessment_answer_selected');

/**
 * Track: assessment_profile_update_failed
 */
export const assessmentProfileUpdateFailed = () => track('assessment_profile_update_failed');

/**
 * Track: assessment_completion_failed
 */
export const assessmentCompletionFailed = () => track('assessment_completion_failed');

/**
 * Track: dashboard_navigation_clicked
 */
export const dashboardNavigationClicked = () => track('dashboard_navigation_clicked');

/**
 * Track: auth_redirected
 */
export const authRedirected = () => track('auth_redirected');

/**
 * Track: profile_settings_toggled
 */
export const profileSettingsToggled = () => track('profile_settings_toggled');

/**
 * Track: profile_settings_save_failed
 */
export const profileSettingsSaveFailed = () => track('profile_settings_save_failed');

/**
 * Track: timed_challenge_game_started
 */
export const timedChallengeGameStarted = () => track('timed_challenge_game_started');

/**
 * Track: timed_challenge_game_reset
 */
export const timedChallengeGameReset = () => track('timed_challenge_game_reset');

/**
 * Track: timed_challenge_dashboard_navigated
 */
export const timedChallengeDashboardNavigated = () => track('timed_challenge_dashboard_navigated');

/**
 * Track: writing_practice_progress_navigated
 */
export const writingPracticeProgressNavigated = () => track('writing_practice_progress_navigated');

/**
 * Track: courses_page_navigated
 */
export const coursesPageNavigated = () => track('courses_page_navigated');

/**
 * Track: command_shortcut_modal_opened
 */
export const commandShortcutModalOpened = () => track('command_shortcut_modal_opened');

/**
 * Track: command_shortcut_search_performed
 */
export const commandShortcutSearchPerformed = () => track('command_shortcut_search_performed');

/**
 * All analytics tracking functions
 */
export const analytics = {
  profileSettingsSaved,
  pageViewed,
  signupFormSubmitted,
  loginFormSubmitted,
  passwordResetRequested,
  assessmentStarted,
  assessmentQuestionAnswered,
  assessmentCompleted,
  assessmentFailed,
  profileSettingsUpdated,
  displayFuriganaToggled,
  quizAutoAdvanceToggled,
  showStrokeOrderToggled,
  quickQuizStarted,
  quickQuizRestarted,
  timedChallengeStarted,
  timedChallengeAnswerSubmitted,
  timedChallengeRestarted,
  writingPracticeStarted,
  learningPathNavigated,
  coursesPageViewed,
  modalOpened,
  commandDialogOpened,
  commandSearchPerformed,
  achievementViewed,
  achievementEarned,
  abandonedSessionsFixed,
  quickQuizActionClicked,
  formSubmitted,
  passwordResetFailed,
  timedChallengeNavigationClicked,
  timedChallengeTypeSelected,
  linkClicked,
  assessmentNavigationClicked,
  assessmentAnswerSelected,
  assessmentProfileUpdateFailed,
  assessmentCompletionFailed,
  dashboardNavigationClicked,
  authRedirected,
  profileSettingsToggled,
  profileSettingsSaveFailed,
  timedChallengeGameStarted,
  timedChallengeGameReset,
  timedChallengeDashboardNavigated,
  writingPracticeProgressNavigated,
  coursesPageNavigated,
  commandShortcutModalOpened,
  commandShortcutSearchPerformed,
};
