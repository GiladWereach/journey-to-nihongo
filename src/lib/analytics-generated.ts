/**
 * Weave BI Tracking
 * Auto-generated - DO NOT EDIT
 *
 * Generated at: 2025-11-01T21:58:31.180Z
 * Total events: 42
 */

import { track } from './weave-bi';

/**
 * Track: page_viewed
 */
export const pageViewed = () => track('page_viewed');

/**
 * Track: achievement_viewed
 */
export const achievementViewed = () => track('achievement_viewed');

/**
 * Track: achievement_link_clicked
 */
export const achievementLinkClicked = () => track('achievement_link_clicked');

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
 * Track: assessment_dashboard_navigated
 */
export const assessmentDashboardNavigated = () => track('assessment_dashboard_navigated');

/**
 * Track: auth_page_viewed
 */
export const authPageViewed = () => track('auth_page_viewed');

/**
 * Track: login_attempted
 */
export const loginAttempted = () => track('login_attempted');

/**
 * Track: login_succeeded
 */
export const loginSucceeded = () => track('login_succeeded');

/**
 * Track: login_failed
 */
export const loginFailed = () => track('login_failed');

/**
 * Track: signup_attempted
 */
export const signupAttempted = () => track('signup_attempted');

/**
 * Track: signup_succeeded
 */
export const signupSucceeded = () => track('signup_succeeded');

/**
 * Track: signup_failed
 */
export const signupFailed = () => track('signup_failed');

/**
 * Track: edit_profile_page_viewed
 */
export const editProfilePageViewed = () => track('edit_profile_page_viewed');

/**
 * Track: profile_settings_toggled
 */
export const profileSettingsToggled = () => track('profile_settings_toggled');

/**
 * Track: profile_saved
 */
export const profileSaved = () => track('profile_saved');

/**
 * Track: profile_save_failed
 */
export const profileSaveFailed = () => track('profile_save_failed');

/**
 * Track: quick_quiz_page_viewed
 */
export const quickQuizPageViewed = () => track('quick_quiz_page_viewed');

/**
 * Track: quick_quiz_go_home_clicked
 */
export const quickQuizGoHomeClicked = () => track('quick_quiz_go_home_clicked');

/**
 * Track: quick_quiz_restart_clicked
 */
export const quickQuizRestartClicked = () => track('quick_quiz_restart_clicked');

/**
 * Track: reset_password_page_viewed
 */
export const resetPasswordPageViewed = () => track('reset_password_page_viewed');

/**
 * Track: password_reset_attempted
 */
export const passwordResetAttempted = () => track('password_reset_attempted');

/**
 * Track: password_reset_succeeded
 */
export const passwordResetSucceeded = () => track('password_reset_succeeded');

/**
 * Track: password_reset_failed
 */
export const passwordResetFailed = () => track('password_reset_failed');

/**
 * Track: timed_challenge_page_viewed
 */
export const timedChallengePageViewed = () => track('timed_challenge_page_viewed');

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
 * Track: timed_challenge_reset
 */
export const timedChallengeReset = () => track('timed_challenge_reset');

/**
 * Track: timed_challenge_dashboard_navigated
 */
export const timedChallengeDashboardNavigated = () => track('timed_challenge_dashboard_navigated');

/**
 * Track: writing_practice_page_viewed
 */
export const writingPracticePageViewed = () => track('writing_practice_page_viewed');

/**
 * Track: writing_practice_progress_navigated
 */
export const writingPracticeProgressNavigated = () => track('writing_practice_progress_navigated');

/**
 * Track: abandoned_sessions_fixed
 */
export const abandonedSessionsFixed = () => track('abandoned_sessions_fixed');

/**
 * Track: learning_path_section_viewed
 */
export const learningPathSectionViewed = () => track('learning_path_section_viewed');

/**
 * Track: learning_path_navigated
 */
export const learningPathNavigated = () => track('learning_path_navigated');

/**
 * Track: courses_page_navigated
 */
export const coursesPageNavigated = () => track('courses_page_navigated');

/**
 * Track: modal_opened
 */
export const modalOpened = () => track('modal_opened');

/**
 * Track: search_performed
 */
export const searchPerformed = () => track('search_performed');

/**
 * All analytics tracking functions
 */
export const analytics = {
  pageViewed,
  achievementViewed,
  achievementLinkClicked,
  assessmentStarted,
  assessmentQuestionAnswered,
  assessmentNextQuestionClicked,
  assessmentPreviousQuestionClicked,
  assessmentCompleted,
  assessmentFailed,
  assessmentDashboardNavigated,
  authPageViewed,
  loginAttempted,
  loginSucceeded,
  loginFailed,
  signupAttempted,
  signupSucceeded,
  signupFailed,
  editProfilePageViewed,
  profileSettingsToggled,
  profileSaved,
  profileSaveFailed,
  quickQuizPageViewed,
  quickQuizGoHomeClicked,
  quickQuizRestartClicked,
  resetPasswordPageViewed,
  passwordResetAttempted,
  passwordResetSucceeded,
  passwordResetFailed,
  timedChallengePageViewed,
  timedChallengeTypeSelected,
  timedChallengeStarted,
  timedChallengeAnswerSubmitted,
  timedChallengeReset,
  timedChallengeDashboardNavigated,
  writingPracticePageViewed,
  writingPracticeProgressNavigated,
  abandonedSessionsFixed,
  learningPathSectionViewed,
  learningPathNavigated,
  coursesPageNavigated,
  modalOpened,
  searchPerformed,
};
