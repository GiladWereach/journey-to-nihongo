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
 * Total Events: 22
 * Auto-implemented: 13
 * Manual: 9
 * 
 * Events:
 * - learning_path_section_clicked (click - auto)
 * - setting_toggled (click - auto)
 * - logout_completed (custom - manual)
 * - achievements_page_viewed (load - auto)
 * - practice_session_restarted (click - auto)
 * - kana_type_selected (click - auto)
 * - assessment_question_answered (custom - manual)
 * - timed_challenge_question_answered (custom - manual)
 * - profile_settings_updated (click - auto)
 * - password_reset_requested (custom - manual)
 * - navigation_link_clicked (route_change - auto)
 * - profile_navigated_to (route_change - auto)
 * - dashboard_navigated_to (route_change - auto)
 * - page_viewed (load - manual)
 * - timed_challenge_completed (custom - manual)
 * - assessment_started (click - auto)
 * - achievement_unlocked (custom - manual)
 * - login_completed (submit - auto)
 * - signup_completed (submit - auto)
 * - password_reset_completed (custom - manual)
 * - timed_challenge_started (click - auto)
 * - assessment_completed (custom - manual)
 */
