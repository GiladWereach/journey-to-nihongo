/**
 * Auto-generated Event Service
 * This file is generated automatically based on your tracking plan.
 * 
 * Auto-implemented events: 13
 * Manual events: 9
 */

import type { CodeTrackClient } from './sdk/core/client';

let tracker: CodeTrackClient;
let observer: MutationObserver | null = null;

/**
 * Initialize the event service with auto-tracking
 */
export function initEventService(trackingInstance: CodeTrackClient): void {
  tracker = trackingInstance;
  console.log('[CodeTrack] Event service connected');
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAutoTracking);
  } else {
    setupAutoTracking();
  }
}

/**
 * Setup all auto-tracking listeners
 */
function setupAutoTracking(): void {
  // Setup route change tracking for SPAs
  setupRouteChangeTracking();

  // Click event listeners
    // A user clicked on a learning path section
  setupClickListener('[data-event="learning_path_section_clicked"], [data-action="learning-path-section"], button.learning-path-section, .learning-path-section-button', (element) => {
    const eventData = {
      user_id: element.getAttribute('data-user-id') || undefined,
      section_name: element.getAttribute('data-section-name') || undefined,
      page_url: window.location.href,
    };
    console.log('[CodeTrack] Event tracked:', 'learning_path_section_clicked', eventData);
    tracker.track('learning_path_section_clicked', eventData);
  });

    // A user toggled a setting in their profile
  setupClickListener('[data-event="setting_toggled"], [data-action="setting-toggled"], button.setting-toggled, .setting-toggled-button', (element) => {
    const eventData = {
      user_id: element.getAttribute('data-user-id') || undefined,
      setting_name: element.getAttribute('data-setting-name') || undefined,
      new_value: element.getAttribute('data-new-value') || undefined,
      page_url: window.location.href,
    };
    console.log('[CodeTrack] Event tracked:', 'setting_toggled', eventData);
    tracker.track('setting_toggled', eventData);
  });

    // A user restarted a practice session
  setupClickListener('[data-event="practice_session_restarted"], [data-action="practice-session-restarted"], button.practice-session-restarted, .practice-session-restarted-button', (element) => {
    const eventData = {
      user_id: element.getAttribute('data-user-id') || undefined,
      practice_type: element.getAttribute('data-practice-type') || undefined,
      page_url: window.location.href,
    };
    console.log('[CodeTrack] Event tracked:', 'practice_session_restarted', eventData);
    tracker.track('practice_session_restarted', eventData);
  });

    // User selected a Kana type (Hiragana/Katakana) for learning or challenge
  setupClickListener('[data-event="kana_type_selected"], [data-action="kana-type-selected"], button.kana-type-selected, .kana-type-selected-button', (element) => {
    const eventData = {
      user_id: element.getAttribute('data-user-id') || undefined,
      kana_type: element.getAttribute('data-kana-type') || undefined,
      page_url: window.location.href,
    };
    console.log('[CodeTrack] Event tracked:', 'kana_type_selected', eventData);
    tracker.track('kana_type_selected', eventData);
  });

    // A user updated their profile settings
  setupClickListener('[data-event="profile_settings_updated"], [data-action="profile-settings-updated"], button.profile-settings-updated, .profile-settings-updated-button', (element) => {
    const eventData = {
      user_id: element.getAttribute('data-user-id') || undefined,
      setting_name: element.getAttribute('data-setting-name') || undefined,
      new_value: element.getAttribute('data-new-value') || undefined,
      page_url: window.location.href,
    };
    console.log('[CodeTrack] Event tracked:', 'profile_settings_updated', eventData);
    tracker.track('profile_settings_updated', eventData);
  });

    // A user started the learning level assessment
  setupClickListener('[data-event="assessment_started"], [data-action="assessment-started"], button.assessment-started, .assessment-started-button', (element) => {
    const eventData = {
      user_id: element.getAttribute('data-user-id') || undefined,
      page_url: window.location.href,
    };
    console.log('[CodeTrack] Event tracked:', 'assessment_started', eventData);
    tracker.track('assessment_started', eventData);
  });

    // A user started a timed challenge
  setupClickListener('[data-event="timed_challenge_started"], [data-action="timed-challenge-started"], button.timed-challenge-started, .timed-challenge-started-button', (element) => {
    const eventData = {
      user_id: element.getAttribute('data-user-id') || undefined,
      challenge_type: element.getAttribute('data-challenge-type') || undefined,
      page_url: window.location.href,
    };
    console.log('[CodeTrack] Event tracked:', 'timed_challenge_started', eventData);
    tracker.track('timed_challenge_started', eventData);
  });

  // Form submit listeners
    // A user successfully logged in
  document.addEventListener('submit', (e) => {
    const form = e.target as HTMLFormElement;
    if (form.matches('form[name="login"], form#login-form, form[data-form="login"]')) {
      e.preventDefault();
      const formData = new FormData(form);
      const properties: Record<string, any> = {};
      formData.forEach((value, key) => {
        properties[key] = value;
      });
      const eventData = {
        ...properties,
        page_url: window.location.href,
      };
      console.log('[CodeTrack] Event tracked:', 'login_completed', eventData);
      tracker.track('login_completed', eventData);
      // Submit form after tracking
      form.submit();
    }
  });

    // A new user successfully signed up
  document.addEventListener('submit', (e) => {
    const form = e.target as HTMLFormElement;
    if (form.matches('form[name="signup"], form#signup-form, form[data-form="signup"]')) {
      e.preventDefault();
      const formData = new FormData(form);
      const properties: Record<string, any> = {};
      formData.forEach((value, key) => {
        properties[key] = value;
      });
      const eventData = {
        ...properties,
        page_url: window.location.href,
      };
      console.log('[CodeTrack] Event tracked:', 'signup_completed', eventData);
      tracker.track('signup_completed', eventData);
      // Submit form after tracking
      form.submit();
    }
  });

  // Page load events
    // User navigated to the achievements page
  (() => {
    const eventData_achievements_page_viewed = {
    user_id: new URLSearchParams(window.location.search).get('user_id') || undefined,
    page_url: window.location.href,
  };
    console.log('[CodeTrack] Event tracked:', 'achievements_page_viewed', eventData_achievements_page_viewed);
    tracker.track('achievements_page_viewed', eventData_achievements_page_viewed);
  })();

  // Route change listeners (for SPAs)
    // A user clicked on a navigation link
  let lastPath = window.location.pathname;
  setInterval(() => {
    if (window.location.pathname !== lastPath) {
      const eventData = {
        page_url: window.location.href,
        page_path: window.location.pathname,
        from_path: lastPath,
      };
      console.log('[CodeTrack] Event tracked:', 'navigation_link_clicked', eventData);
      tracker.track('navigation_link_clicked', eventData);
      lastPath = window.location.pathname;
    }
  }, 100);

    // A user navigated to their profile page
  let lastPath = window.location.pathname;
  setInterval(() => {
    if (window.location.pathname !== lastPath) {
      const eventData = {
        page_url: window.location.href,
        page_path: window.location.pathname,
        from_path: lastPath,
      };
      console.log('[CodeTrack] Event tracked:', 'profile_navigated_to', eventData);
      tracker.track('profile_navigated_to', eventData);
      lastPath = window.location.pathname;
    }
  }, 100);

    // A user navigated to the dashboard page
  let lastPath = window.location.pathname;
  setInterval(() => {
    if (window.location.pathname !== lastPath) {
      const eventData = {
        page_url: window.location.href,
        page_path: window.location.pathname,
        from_path: lastPath,
      };
      console.log('[CodeTrack] Event tracked:', 'dashboard_navigated_to', eventData);
      tracker.track('dashboard_navigated_to', eventData);
      lastPath = window.location.pathname;
    }
  }, 100);

  // Setup mutation observer for dynamically added elements
  setupMutationObserver();
}

/**
 * Track route changes as page views (for SPAs like React Router)
 */
function setupRouteChangeTracking(): void {
  let lastPath = window.location.pathname;
  
  // Track initial page view
  tracker.track('page_viewed', {
    page_url: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
  });
  
  // Monitor for route changes
  const checkRouteChange = () => {
    if (window.location.pathname !== lastPath) {
      tracker.track('page_viewed', {
        page_url: window.location.href,
        page_path: window.location.pathname,
        page_title: document.title,
        previous_path: lastPath,
      });
      lastPath = window.location.pathname;
    }
  };
  
  // Poll for route changes (works with React Router and other SPAs)
  setInterval(checkRouteChange, 100);
  
  // Also listen to browser navigation events
  window.addEventListener('popstate', checkRouteChange);
}

/**
 * Setup mutation observer to handle dynamically added elements
 */
function setupMutationObserver(): void {
  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          // Re-attach listeners to new elements
          attachListenersToElement(element);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

/**
 * Attach listeners to a specific element
 */
function attachListenersToElement(element: Element): void {
    // Check for learning_path_section_clicked
  if (element.matches('[data-event="learning_path_section_clicked"], [data-action="learning-path-section"], button.learning-path-section, .learning-path-section-button')) {
    element.addEventListener('click', () => {
      tracker.track('learning_path_section_clicked', extractProperties(element));
    });
  }
  // Check for setting_toggled
  if (element.matches('[data-event="setting_toggled"], [data-action="setting-toggled"], button.setting-toggled, .setting-toggled-button')) {
    element.addEventListener('click', () => {
      tracker.track('setting_toggled', extractProperties(element));
    });
  }
  // Check for practice_session_restarted
  if (element.matches('[data-event="practice_session_restarted"], [data-action="practice-session-restarted"], button.practice-session-restarted, .practice-session-restarted-button')) {
    element.addEventListener('click', () => {
      tracker.track('practice_session_restarted', extractProperties(element));
    });
  }
  // Check for kana_type_selected
  if (element.matches('[data-event="kana_type_selected"], [data-action="kana-type-selected"], button.kana-type-selected, .kana-type-selected-button')) {
    element.addEventListener('click', () => {
      tracker.track('kana_type_selected', extractProperties(element));
    });
  }
  // Check for profile_settings_updated
  if (element.matches('[data-event="profile_settings_updated"], [data-action="profile-settings-updated"], button.profile-settings-updated, .profile-settings-updated-button')) {
    element.addEventListener('click', () => {
      tracker.track('profile_settings_updated', extractProperties(element));
    });
  }
  // Check for assessment_started
  if (element.matches('[data-event="assessment_started"], [data-action="assessment-started"], button.assessment-started, .assessment-started-button')) {
    element.addEventListener('click', () => {
      tracker.track('assessment_started', extractProperties(element));
    });
  }
  // Check for login_completed
  if (element.matches('form[name="login"], form#login-form, form[data-form="login"]')) {
    element.addEventListener('submit', () => {
      tracker.track('login_completed', extractProperties(element));
    });
  }
  // Check for signup_completed
  if (element.matches('form[name="signup"], form#signup-form, form[data-form="signup"]')) {
    element.addEventListener('submit', () => {
      tracker.track('signup_completed', extractProperties(element));
    });
  }
  // Check for timed_challenge_started
  if (element.matches('[data-event="timed_challenge_started"], [data-action="timed-challenge-started"], button.timed-challenge-started, .timed-challenge-started-button')) {
    element.addEventListener('click', () => {
      tracker.track('timed_challenge_started', extractProperties(element));
    });
  }
}

/**
 * Extract properties from an element
 */
function extractProperties(element: Element): Record<string, any> {
  const properties: Record<string, any> = {};
  
  // Extract data attributes
  Array.from(element.attributes).forEach(attr => {
    if (attr.name.startsWith('data-')) {
      const key = attr.name.replace('data-', '').replace(/-/g, '_');
      properties[key] = attr.value;
    }
  });

  // Add common context
  properties.page_url = window.location.href;
  properties.page_path = window.location.pathname;
  
  return properties;
}

/**
 * Setup click listener with selector
 */
function setupClickListener(selector: string, handler: (element: Element) => void): void {
  document.addEventListener('click', (e) => {
    const target = e.target as Element;
    const element = target.matches(selector) ? target : target.closest(selector);
    
    if (element) {
      handler(element);
    }
  });
}

/**
 * Cleanup function
 */
export function destroyEventService(): void {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

// ============================================
// Manual Event Helpers
// ============================================
/**
 * A user logged out of the application
 * Priority: medium
 * 
 * Call this function when: A user logged out of the application
 * 
 * @example
 * trackLogoutCompleted({ user_id: 'user_id_value' });
 */
export function trackLogoutCompleted(properties: { user_id: string }): void {
  const eventData = {
    user_id: properties.user_id,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'logout_completed', eventData);
  tracker.track('logout_completed', eventData);
}

/**
 * A user answered a question in the assessment
 * Priority: medium
 * 
 * Call this function when: A user answered a question in the assessment
 * 
 * @example
 * trackAssessmentQuestionAnswered({ user_id: 'user_id_value', question_number: 'question_number_value', selected_answer: 'selected_answer_value', correct_answer: 'correct_answer_value', is_correct: 'is_correct_value' });
 */
export function trackAssessmentQuestionAnswered(properties: { user_id: string, question_number: string, selected_answer: string, correct_answer: string, is_correct: string }): void {
  const eventData = {
    user_id: properties.user_id,
    question_number: properties.question_number,
    selected_answer: properties.selected_answer,
    correct_answer: properties.correct_answer,
    is_correct: properties.is_correct,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'assessment_question_answered', eventData);
  tracker.track('assessment_question_answered', eventData);
}

/**
 * A user answered a question in a timed challenge
 * Priority: medium
 * 
 * Call this function when: A user answered a question in a timed challenge
 * 
 * @example
 * trackTimedChallengeQuestionAnswered({ user_id: 'user_id_value', challenge_type: 'challenge_type_value', question_number: 'question_number_value', selected_answer: 'selected_answer_value', is_correct: 'is_correct_value' });
 */
export function trackTimedChallengeQuestionAnswered(properties: { user_id: string, challenge_type: string, question_number: string, selected_answer: string, is_correct: string }): void {
  const eventData = {
    user_id: properties.user_id,
    challenge_type: properties.challenge_type,
    question_number: properties.question_number,
    selected_answer: properties.selected_answer,
    is_correct: properties.is_correct,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'timed_challenge_question_answered', eventData);
  tracker.track('timed_challenge_question_answered', eventData);
}

/**
 * A user requested a password reset
 * Priority: medium
 * 
 * Call this function when: A user requested a password reset
 * 
 * @example
 * trackPasswordResetRequested({ email: 'email_value' });
 */
export function trackPasswordResetRequested(properties: { email: string }): void {
  const eventData = {
    email: properties.email,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'password_reset_requested', eventData);
  tracker.track('password_reset_requested', eventData);
}

/**
 * A user viewed a page
 * Priority: low
 * 
 * Call this function when: A user viewed a page
 * 
 * @example
 * trackPageViewed({ page_path: 'page_path_value', page_title: 'page_title_value', user_id: 'user_id_value', learning_level: 'learning_level_value' });
 */
export function trackPageViewed(properties: { page_path: string, page_title: string, user_id: string, learning_level: string }): void {
  const eventData = {
    page_path: properties.page_path,
    page_title: properties.page_title,
    user_id: properties.user_id,
    learning_level: properties.learning_level,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'page_viewed', eventData);
  tracker.track('page_viewed', eventData);
}

/**
 * A user completed a timed challenge
 * Priority: high
 * 
 * Call this function when: A user completed a timed challenge
 * 
 * @example
 * trackTimedChallengeCompleted({ user_id: 'user_id_value', challenge_type: 'challenge_type_value', score: 'score_value', time_taken: 'time_taken_value' });
 */
export function trackTimedChallengeCompleted(properties: { user_id: string, challenge_type: string, score: string, time_taken: string }): void {
  const eventData = {
    user_id: properties.user_id,
    challenge_type: properties.challenge_type,
    score: properties.score,
    time_taken: properties.time_taken,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'timed_challenge_completed', eventData);
  tracker.track('timed_challenge_completed', eventData);
}

/**
 * A user unlocked an achievement
 * Priority: high
 * 
 * Call this function when: A user unlocked an achievement
 * 
 * @example
 * trackAchievementUnlocked({ user_id: 'user_id_value', achievement_id: 'achievement_id_value', achievement_name: 'achievement_name_value' });
 */
export function trackAchievementUnlocked(properties: { user_id: string, achievement_id: string, achievement_name: string }): void {
  const eventData = {
    user_id: properties.user_id,
    achievement_id: properties.achievement_id,
    achievement_name: properties.achievement_name,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'achievement_unlocked', eventData);
  tracker.track('achievement_unlocked', eventData);
}

/**
 * A user successfully reset their password
 * Priority: high
 * 
 * Call this function when: A user successfully reset their password
 * 
 * @example
 * trackPasswordResetCompleted({ user_id: 'user_id_value' });
 */
export function trackPasswordResetCompleted(properties: { user_id: string }): void {
  const eventData = {
    user_id: properties.user_id,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'password_reset_completed', eventData);
  tracker.track('password_reset_completed', eventData);
}

/**
 * A user completed the learning level assessment
 * Priority: high
 * 
 * Call this function when: A user completed the learning level assessment
 * 
 * @example
 * trackAssessmentCompleted({ user_id: 'user_id_value', score: 'score_value', percentage: 'percentage_value', learning_level_assigned: 'learning_level_assigned_value' });
 */
export function trackAssessmentCompleted(properties: { user_id: string, score: string, percentage: string, learning_level_assigned: string }): void {
  const eventData = {
    user_id: properties.user_id,
    score: properties.score,
    percentage: properties.percentage,
    learning_level_assigned: properties.learning_level_assigned,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'assessment_completed', eventData);
  tracker.track('assessment_completed', eventData);
}
