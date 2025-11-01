/**
 * Weave BI Tracking
 * Auto-generated - DO NOT EDIT
 *
 * Generated at: 2025-11-01T19:42:40.624Z
 * Total events: 26
 */

import { track } from './weave-bi';

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
 * All analytics tracking functions
 */
export const analytics = {
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
};
