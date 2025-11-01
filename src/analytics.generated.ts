/**
 * Weave Analytics Tracking
 * Auto-generated - DO NOT EDIT
 *
 * Generated at: 2025-11-01T18:04:28.836Z
 * Total events: 26
 */

import { track } from '@weave-bi/sdk';

/**
 * Track: page_viewed
 */
export const pageViewed = (props: {
  undefined: any;
  undefined: any;
  undefined: any;
}) => track('page_viewed', props);

/**
 * Track: signup_form_submitted
 */
export const signupFormSubmitted = (props: {
  undefined: any;
  undefined: any;
  undefined: any;
}) => track('signup_form_submitted', props);

/**
 * Track: login_form_submitted
 */
export const loginFormSubmitted = (props: {
  undefined: any;
  undefined: any;
  undefined: any;
}) => track('login_form_submitted', props);

/**
 * Track: password_reset_requested
 */
export const passwordResetRequested = (props: {
  undefined: any;
  undefined: any;
  undefined: any;
}) => track('password_reset_requested', props);

/**
 * Track: assessment_started
 */
export const assessmentStarted = (props: {
  undefined: any;
}) => track('assessment_started', props);

/**
 * Track: assessment_question_answered
 */
export const assessmentQuestionAnswered = (props: {
  undefined: any;
  undefined: any;
  undefined: any;
  undefined: any;
}) => track('assessment_question_answered', props);

/**
 * Track: assessment_completed
 */
export const assessmentCompleted = (props: {
  undefined: any;
  undefined: any;
  undefined: any;
  undefined: any;
}) => track('assessment_completed', props);

/**
 * Track: assessment_failed
 */
export const assessmentFailed = (props: {
  undefined: any;
}) => track('assessment_failed', props);

/**
 * Track: profile_settings_updated
 */
export const profileSettingsUpdated = (props: {
  undefined: any;
  undefined: any;
}) => track('profile_settings_updated', props);

/**
 * Track: display_furigana_toggled
 */
export const displayFuriganaToggled = (props: {
  undefined: any;
}) => track('display_furigana_toggled', props);

/**
 * Track: quiz_auto_advance_toggled
 */
export const quizAutoAdvanceToggled = (props: {
  undefined: any;
}) => track('quiz_auto_advance_toggled', props);

/**
 * Track: show_stroke_order_toggled
 */
export const showStrokeOrderToggled = (props: {
  undefined: any;
}) => track('show_stroke_order_toggled', props);

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
export const timedChallengeStarted = (props: {
  undefined: any;
}) => track('timed_challenge_started', props);

/**
 * Track: timed_challenge_answer_submitted
 */
export const timedChallengeAnswerSubmitted = (props: {
  undefined: any;
  undefined: any;
}) => track('timed_challenge_answer_submitted', props);

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
export const learningPathNavigated = (props: {
  undefined: any;
  undefined: any;
}) => track('learning_path_navigated', props);

/**
 * Track: courses_page_viewed
 */
export const coursesPageViewed = () => track('courses_page_viewed');

/**
 * Track: modal_opened
 */
export const modalOpened = (props: {
  undefined: any;
}) => track('modal_opened', props);

/**
 * Track: command_dialog_opened
 */
export const commandDialogOpened = () => track('command_dialog_opened');

/**
 * Track: command_search_performed
 */
export const commandSearchPerformed = (props: {
  undefined: any;
}) => track('command_search_performed', props);

/**
 * Track: achievement_viewed
 */
export const achievementViewed = (props: {
  undefined: any;
}) => track('achievement_viewed', props);

/**
 * Track: achievement_earned
 */
export const achievementEarned = (props: {
  undefined: any;
  undefined: any;
}) => track('achievement_earned', props);

/**
 * Track: abandoned_sessions_fixed
 */
export const abandonedSessionsFixed = (props: {
  undefined: any;
  undefined: any;
}) => track('abandoned_sessions_fixed', props);

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
