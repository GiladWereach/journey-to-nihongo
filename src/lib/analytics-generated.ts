/**
 * Weave BI Tracking Functions
 * Auto-generated - DO NOT EDIT
 *
 * Generated at: 2025-11-02T15:05:46.895Z
 * Total events: 49
 * - Auto-tracked: 0 (clicks, forms, page views)
 * - Manual implementation: 49 (business logic events)
 *
 * USAGE:
 *
 * 1. AUTO-TRACKED EVENTS (0):
 *    These fire automatically when users interact with your app.
 *    No code needed - just import '@/lib/analytics' in your app entry point.
 *    
 *
 * 2. MANUAL EVENTS (49):
 *    Call these functions in your business logic:
 *    - page_viewed
 *    - achievements_page_viewed
 *    - assessment_page_viewed
 *    ... and 46 more
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
 * Track: assessment_started
 */
export const assessmentStarted = () => track('assessment_started');

/**
 * Track: assessment_question_answered
 */
export const assessmentQuestionAnswered = () => track('assessment_question_answered');

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
 * Track: quick_quiz_restarted
 */
export const quickQuizRestarted = () => track('quick_quiz_restarted');

/**
 * Track: password_reset_requested
 */
export const passwordResetRequested = () => track('password_reset_requested');

/**
 * Track: password_reset_failed
 */
export const passwordResetFailed = () => track('password_reset_failed');

/**
 * Track: timed_challenge_type_selected
 */
export const timedChallengeTypeSelected = () => track('timed_challenge_type_selected');

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
  assessmentStarted,
  assessmentQuestionAnswered,
  assessmentNextQuestionClicked,
  assessmentPreviousQuestionClicked,
  assessmentCompleted,
  assessmentFailed,
  loginAttempted,
  loginCompleted,
  loginFailed,
  signupAttempted,
  signupCompleted,
  signupFailed,
  profileSettingsUpdated,
  displayFuriganaToggled,
  quizAutoAdvanceToggled,
  showStrokeOrderToggled,
  quickQuizRestarted,
  passwordResetRequested,
  passwordResetFailed,
  timedChallengeTypeSelected,
  timedChallengeStarted,
  timedChallengeAnswerSubmitted,
  timedChallengeRestarted,
  abandonedSessionsFixed,
  learningPathNavigated,
  coursesPageNavigated,
  alertDialogOpened,
  commandDialogOpened,
  commandSearchPerformed,
  dialogOpened,
};
