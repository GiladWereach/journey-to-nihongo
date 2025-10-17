import { CodeTrack } from '@codetrack/sdk';
import { initEventService } from './event-service';

// Initialize CodeTrack with your integrations
CodeTrack.init({
  projectId: 'YOUR_PROJECT_ID', // TODO: Replace with your actual project ID
  integrations: {
    // Configure your integrations here
    // amplitude: { apiKey: 'YOUR_AMPLITUDE_KEY' },
    // mixpanel: { token: 'YOUR_MIXPANEL_TOKEN' },
    // ga4: { measurementId: 'YOUR_GA4_ID' },
  },
  autoTrack: {
    pageViews: true,
    clicks: false, // Handled by event service
    errors: true,
    performance: true,
  },
  debug: process.env.NODE_ENV === 'development',
});

// Initialize auto-event tracking
initEventService(CodeTrack);

export { CodeTrack };

/**
 * Tracking Plan Summary
 * Total Events: 25
 * Auto-implemented: 0
 * Manual: 25
 * 
 * Events:
 * - search_performed (custom - manual)
 * - quiz_started (custom - manual)
 * - premium_feature_accessed (custom - manual)
 * - achievement_unlocked (custom - manual)
 * - lesson_started (custom - manual)
 * - feedback_submitted (custom - manual)
 * - flashcard_deck_accessed (custom - manual)
 * - flashcard_studied (custom - manual)
 * - streak_maintained (custom - manual)
 * - signup_started (custom - manual)
 * - content_shared (custom - manual)
 * - ad_viewed (custom - manual)
 * - logout_completed (custom - manual)
 * - profile_updated (custom - manual)
 * - settings_updated (custom - manual)
 * - page_viewed (custom - manual)
 * - signup_completed (custom - manual)
 * - lesson_completed (custom - manual)
 * - quiz_completed (custom - manual)
 * - question_answered (custom - manual)
 * - subscription_started (custom - manual)
 * - subscription_renewed (custom - manual)
 * - subscription_cancelled (custom - manual)
 * - purchase_made (custom - manual)
 * - login_successful (custom - manual)
 */
