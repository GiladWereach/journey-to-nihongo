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
 * Total Events: 25
 * Auto-implemented: 13
 * Manual: 12
 * 
 * Events:
 * - page_viewed (load - manual)
 * - timed_challenge_reset (custom - manual)
 * - learning_path_progressed (custom - manual)
 * - quick_quiz_restarted (click - auto)
 * - timed_challenge_question_answered (custom - manual)
 * - quick_quiz_returned_home (custom - manual)
 * - login_failed (submit - auto)
 * - logout_completed (custom - manual)
 * - password_reset_requested (custom - manual)
 * - achievement_link_clicked (route_change - auto)
 * - dashboard_link_clicked (route_change - auto)
 * - assessment_question_answered (custom - manual)
 * - edit_profile_settings_updated (click - auto)
 * - assessment_redirected_to_dashboard (route_change - auto)
 * - assessment_completed (custom - manual)
 * - timed_challenge_completed (custom - manual)
 * - learning_path_started (click - auto)
 * - edit_profile_saved (click - auto)
 * - writing_practice_completed (custom - manual)
 * - assessment_started (click - auto)
 * - signup_started (submit - auto)
 * - signup_completed (submit - auto)
 * - login_succeeded (submit - auto)
 * - timed_challenge_started (click - auto)
 * - password_reset_completed (custom - manual)
 */
