import { CodeTrack } from './sdk';
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
    pageViews: false, // Handled by event service route tracking
    clicks: true, // Track ALL buttons and links automatically
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
 * Total Events: 15
 * Auto-implemented: 7
 * Manual: 8
 * 
 * Events:
 * - password_reset_requested (custom - manual)
 * - timed_challenge_started (click - auto)
 * - profile_updated (submit - auto)
 * - writing_practice_started (click - auto)
 * - writing_practice_completed (custom - manual)
 * - logout_completed (custom - manual)
 * - learning_path_card_clicked (click - auto)
 * - kana_mastery_level_changed (custom - manual)
 * - quiz_session_started (click - auto)
 * - signup_completed (submit - auto)
 * - login_completed (submit - auto)
 * - assessment_completed (custom - manual)
 * - page_viewed (load - manual)
 * - quiz_session_ended (custom - manual)
 * - timed_challenge_completed (custom - manual)
 */
