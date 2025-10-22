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
 * Total Events: 28
 * Auto-implemented: 21
 * Manual: 7
 * 
 * Events:
 * - quick_quiz_restarted (click - auto)
 * - edit_profile_saved (click - auto)
 * - assessment_question_answered (custom - manual)
 * - timed_challenge_reset (custom - manual)
 * - progress_page_viewed (load - auto)
 * - quiz_page_viewed (load - auto)
 * - learn_page_viewed (load - auto)
 * - kana_learning_page_viewed (load - manual)
 * - achievements_page_viewed (load - auto)
 * - timed_challenge_answer_submitted (submit - auto)
 * - home_page_viewed (load - auto)
 * - auth_page_viewed (submit - auto)
 * - password_reset_requested (custom - manual)
 * - page_viewed (load - manual)
 * - edit_profile_page_viewed (load - auto)
 * - profile_page_viewed (load - auto)
 * - assessment_navigated_back (load - manual)
 * - setting_display_furigana_toggled (click - auto)
 * - setting_quiz_auto_advance_toggled (click - auto)
 * - setting_show_stroke_order_toggled (click - auto)
 * - button_clicked (click - auto)
 * - dashboard_page_viewed (load - auto)
 * - signup_submitted (submit - auto)
 * - assessment_completed (custom - manual)
 * - login_submitted (submit - auto)
 * - assessment_started (click - auto)
 * - timed_challenge_started (click - auto)
 * - assessment_page_viewed (load - auto)
 */
