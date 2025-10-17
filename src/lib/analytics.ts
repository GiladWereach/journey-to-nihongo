import { CodeTrack } from '@codetrack/sdk';

// Initialize CodeTrack SDK with your integrations
CodeTrack.init({
  projectId: 'YOUR_PROJECT_ID',
  integrations: {
    
  },
  autoTracking: {
    pageViews: true,
    clicks: true,
    errors: true,
    performance: true,
  },
  reportHealth: true,
  healthReportInterval: 60000, // 1 minute
  debug: process.env.NODE_ENV === 'development',
});

// Export for use in your app
export { CodeTrack };

/**
 * Tracking Plan
 * 
 * Recommended events:
 * - page_viewed: User viewed a page
 * - quiz_started: User started a quiz
 * - question_answered: User answered a question in a quiz
 * - quiz_completed: User completed a quiz
 * - lesson_started: User started a lesson
 * - lesson_completed: User completed a lesson
 * - flashcard_deck_accessed: User accessed a flashcard deck
 * - flashcard_studied: User studied a flashcard
 * - streak_maintained: User maintained a learning streak
 * - signup_started: User initiated the signup process
 * - signup_completed: User successfully signed up
 * - login_successful: User successfully logged in
 * - logout_completed: User logged out
 * - profile_updated: User updated their profile
 * - settings_updated: User updated application settings
 * - search_performed: User performed a search
 * - content_shared: User shared content (e.g., quiz results, lesson progress)
 * - feedback_submitted: User submitted feedback
 * - achievement_unlocked: User unlocked an achievement
 * - premium_feature_accessed: User accessed a premium feature
 * - subscription_started: User started a premium subscription
 * - subscription_renewed: User renewed their premium subscription
 * - subscription_cancelled: User cancelled their premium subscription
 * - purchase_made: User made a purchase (e.g., in-app purchase for content)
 * - ad_viewed: User viewed an advertisement (if applicable)
 */
