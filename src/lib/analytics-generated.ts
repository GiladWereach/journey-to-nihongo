/**
 * Weave BI Tracking
 * Auto-generated - DO NOT EDIT
 *
 * Generated at: 2025-11-02T00:54:40.984Z
 * Total events: 31
 */

import { track } from './weave-bi';

/**
 * Track: page_viewed
 */
export const pageViewed = () => track('page_viewed');

/**
 * Track: achievement_link_clicked
 */
export const achievementLinkClicked = () => track('achievement_link_clicked');

/**
 * Track: achievements_page_viewed
 */
export const achievementsPageViewed = () => track('achievements_page_viewed');

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
 * Track: auth_login_submitted
 */
export const authLoginSubmitted = () => track('auth_login_submitted');

/**
 * Track: auth_signup_submitted
 */
export const authSignupSubmitted = () => track('auth_signup_submitted');

/**
 * Track: auth_link_clicked
 */
export const authLinkClicked = () => track('auth_link_clicked');

/**
 * Track: profile_settings_updated
 */
export const profileSettingsUpdated = () => track('profile_settings_updated');

/**
 * Track: profile_setting_toggled
 */
export const profileSettingToggled = () => track('profile_setting_toggled');

/**
 * Track: edit_profile_navigated
 */
export const editProfileNavigated = () => track('edit_profile_navigated');

/**
 * Track: quick_quiz_restarted
 */
export const quickQuizRestarted = () => track('quick_quiz_restarted');

/**
 * Track: quick_quiz_home_navigated
 */
export const quickQuizHomeNavigated = () => track('quick_quiz_home_navigated');

/**
 * Track: password_reset_requested
 */
export const passwordResetRequested = () => track('password_reset_requested');

/**
 * Track: timed_challenge_started
 */
export const timedChallengeStarted = () => track('timed_challenge_started');

/**
 * Track: timed_challenge_type_selected
 */
export const timedChallengeTypeSelected = () => track('timed_challenge_type_selected');

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
 * Track: timed_challenge_auth_navigated
 */
export const timedChallengeAuthNavigated = () => track('timed_challenge_auth_navigated');

/**
 * Track: writing_practice_progress_navigated
 */
export const writingPracticeProgressNavigated = () => track('writing_practice_progress_navigated');

/**
 * Track: abandoned_sessions_fixed
 */
export const abandonedSessionsFixed = () => track('abandoned_sessions_fixed');

/**
 * Track: learning_path_navigated
 */
export const learningPathNavigated = () => track('learning_path_navigated');

/**
 * Track: courses_navigated
 */
export const coursesNavigated = () => track('courses_navigated');

/**
 * Track: modal_opened
 */
export const modalOpened = () => track('modal_opened');

/**
 * Track: command_search_performed
 */
export const commandSearchPerformed = () => track('command_search_performed');

/**
 * All analytics tracking functions
 */
export const analytics = {
  pageViewed,
  achievementLinkClicked,
  achievementsPageViewed,
  assessmentStarted,
  assessmentQuestionAnswered,
  assessmentNextQuestionClicked,
  assessmentPreviousQuestionClicked,
  assessmentCompleted,
  assessmentFailed,
  assessmentDashboardNavigated,
  authLoginSubmitted,
  authSignupSubmitted,
  authLinkClicked,
  profileSettingsUpdated,
  profileSettingToggled,
  editProfileNavigated,
  quickQuizRestarted,
  quickQuizHomeNavigated,
  passwordResetRequested,
  timedChallengeStarted,
  timedChallengeTypeSelected,
  timedChallengeAnswerSubmitted,
  timedChallengeReset,
  timedChallengeDashboardNavigated,
  timedChallengeAuthNavigated,
  writingPracticeProgressNavigated,
  abandonedSessionsFixed,
  learningPathNavigated,
  coursesNavigated,
  modalOpened,
  commandSearchPerformed,
};
