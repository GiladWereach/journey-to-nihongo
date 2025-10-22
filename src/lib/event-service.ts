/**
 * Auto-generated Event Service
 * This file is generated automatically based on your tracking plan.
 * 
 * Auto-implemented events: 21
 * Manual events: 7
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
    // User restarts a quick quiz
  setupClickListener('[data-event="quick_quiz_restarted"], [data-action="quick-quiz-restarted"], button.quick-quiz-restarted, .quick-quiz-restarted-button', (element) => {
    const eventData = {
      user_id: element.getAttribute('data-user-id') || undefined,
      page_url: window.location.href,
    };
    console.log('[CodeTrack] Event tracked:', 'quick_quiz_restarted', eventData);
    tracker.track('quick_quiz_restarted', eventData);
  });

    // User saves changes in their profile settings
  setupClickListener('[data-event="edit_profile_saved"], [data-action="edit-profile-saved"], button.edit-profile-saved, .edit-profile-saved-button', (element) => {
    const eventData = {
      user_id: element.getAttribute('data-user-id') || undefined,
      settings_changed: element.getAttribute('data-settings-changed') || undefined,
      page_url: window.location.href,
    };
    console.log('[CodeTrack] Event tracked:', 'edit_profile_saved', eventData);
    tracker.track('edit_profile_saved', eventData);
  });

    // User toggles the 'Display Furigana' setting
  setupClickListener('[data-event="setting_display_furigana_toggled"], [data-action="setting-display-furigana-toggled"], button.setting-display-furigana-toggled, .setting-display-furigana-toggled-button', (element) => {
    const eventData = {
      user_id: element.getAttribute('data-user-id') || undefined,
      new_value: element.getAttribute('data-new-value') || undefined,
      page_url: window.location.href,
    };
    console.log('[CodeTrack] Event tracked:', 'setting_display_furigana_toggled', eventData);
    tracker.track('setting_display_furigana_toggled', eventData);
  });

    // User toggles the 'Quiz Auto Advance' setting
  setupClickListener('[data-event="setting_quiz_auto_advance_toggled"], [data-action="setting-quiz-auto-advance-toggled"], button.setting-quiz-auto-advance-toggled, .setting-quiz-auto-advance-toggled-button', (element) => {
    const eventData = {
      user_id: element.getAttribute('data-user-id') || undefined,
      new_value: element.getAttribute('data-new-value') || undefined,
      page_url: window.location.href,
    };
    console.log('[CodeTrack] Event tracked:', 'setting_quiz_auto_advance_toggled', eventData);
    tracker.track('setting_quiz_auto_advance_toggled', eventData);
  });

    // User toggles the 'Show Stroke Order' setting
  setupClickListener('[data-event="setting_show_stroke_order_toggled"], [data-action="setting-show-stroke-order-toggled"], button.setting-show-stroke-order-toggled, .setting-show-stroke-order-toggled-button', (element) => {
    const eventData = {
      user_id: element.getAttribute('data-user-id') || undefined,
      new_value: element.getAttribute('data-new-value') || undefined,
      page_url: window.location.href,
    };
    console.log('[CodeTrack] Event tracked:', 'setting_show_stroke_order_toggled', eventData);
    tracker.track('setting_show_stroke_order_toggled', eventData);
  });

    // Generic event for tracking button clicks where a specific event is not needed
  setupClickListener('[data-event="button_clicked"], [data-action="button"], button.button, .button-button', (element) => {
    const eventData = {
      button_text: element.getAttribute('data-button-text') || undefined,
      page_name: element.getAttribute('data-page-name') || undefined,
      page_url: window.location.href,
    };
    console.log('[CodeTrack] Event tracked:', 'button_clicked', eventData);
    tracker.track('button_clicked', eventData);
  });

    // User starts the learning level assessment
  setupClickListener('[data-event="assessment_started"], [data-action="assessment-started"], button.assessment-started, .assessment-started-button', (element) => {
    const eventData = {
      user_id: element.getAttribute('data-user-id') || undefined,
      page_url: window.location.href,
    };
    console.log('[CodeTrack] Event tracked:', 'assessment_started', eventData);
    tracker.track('assessment_started', eventData);
  });

    // User starts a timed challenge
  setupClickListener('[data-event="timed_challenge_started"], [data-action="timed-challenge-started"], button.timed-challenge-started, .timed-challenge-started-button', (element) => {
    const eventData = {
      user_id: element.getAttribute('data-user-id') || undefined,
      kana_type_selected: element.getAttribute('data-kana-type-selected') || undefined,
      page_url: window.location.href,
    };
    console.log('[CodeTrack] Event tracked:', 'timed_challenge_started', eventData);
    tracker.track('timed_challenge_started', eventData);
  });

  // Form submit listeners
    // User submits an answer in a timed challenge
  document.addEventListener('submit', (e) => {
    const form = e.target as HTMLFormElement;
    if (form.matches('form[data-event="timed_challenge_answer_submitted"]')) {
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
      console.log('[CodeTrack] Event tracked:', 'timed_challenge_answer_submitted', eventData);
      tracker.track('timed_challenge_answer_submitted', eventData);
      // Submit form after tracking
      form.submit();
    }
  });

    // User views the authentication page (login/signup)
  document.addEventListener('submit', (e) => {
    const form = e.target as HTMLFormElement;
    if (form.matches('form[data-event="auth_page_viewed"]')) {
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
      console.log('[CodeTrack] Event tracked:', 'auth_page_viewed', eventData);
      tracker.track('auth_page_viewed', eventData);
      // Submit form after tracking
      form.submit();
    }
  });

    // User submits the signup form
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
      console.log('[CodeTrack] Event tracked:', 'signup_submitted', eventData);
      tracker.track('signup_submitted', eventData);
      // Submit form after tracking
      form.submit();
    }
  });

    // User submits the login form
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
      console.log('[CodeTrack] Event tracked:', 'login_submitted', eventData);
      tracker.track('login_submitted', eventData);
      // Submit form after tracking
      form.submit();
    }
  });

  // Page load events
    // User views their progress page
  (() => {
    const eventData_progress_page_viewed = {
    user_id: new URLSearchParams(window.location.search).get('user_id') || undefined,
    page_url: window.location.href,
  };
    console.log('[CodeTrack] Event tracked:', 'progress_page_viewed', eventData_progress_page_viewed);
    tracker.track('progress_page_viewed', eventData_progress_page_viewed);
  })();

    // User views a quiz page
  (() => {
    const eventData_quiz_page_viewed = {
    user_id: new URLSearchParams(window.location.search).get('user_id') || undefined,
    page_url: window.location.href,
  };
    console.log('[CodeTrack] Event tracked:', 'quiz_page_viewed', eventData_quiz_page_viewed);
    tracker.track('quiz_page_viewed', eventData_quiz_page_viewed);
  })();

    // User views the main learning page
  (() => {
    const eventData_learn_page_viewed = {
    user_id: new URLSearchParams(window.location.search).get('user_id') || undefined,
    page_url: window.location.href,
  };
    console.log('[CodeTrack] Event tracked:', 'learn_page_viewed', eventData_learn_page_viewed);
    tracker.track('learn_page_viewed', eventData_learn_page_viewed);
  })();

    // User views their achievements page
  (() => {
    const eventData_achievements_page_viewed = {
    user_id: new URLSearchParams(window.location.search).get('user_id') || undefined,
    page_url: window.location.href,
  };
    console.log('[CodeTrack] Event tracked:', 'achievements_page_viewed', eventData_achievements_page_viewed);
    tracker.track('achievements_page_viewed', eventData_achievements_page_viewed);
  })();

    // User views the home page
  (() => {
    const eventData_home_page_viewed = {
    user_id: new URLSearchParams(window.location.search).get('user_id') || undefined,
    page_url: window.location.href,
  };
    console.log('[CodeTrack] Event tracked:', 'home_page_viewed', eventData_home_page_viewed);
    tracker.track('home_page_viewed', eventData_home_page_viewed);
  })();

    // User views the edit profile page
  (() => {
    const eventData_edit_profile_page_viewed = {
    user_id: new URLSearchParams(window.location.search).get('user_id') || undefined,
    page_url: window.location.href,
  };
    console.log('[CodeTrack] Event tracked:', 'edit_profile_page_viewed', eventData_edit_profile_page_viewed);
    tracker.track('edit_profile_page_viewed', eventData_edit_profile_page_viewed);
  })();

    // User views their profile page
  (() => {
    const eventData_profile_page_viewed = {
    user_id: new URLSearchParams(window.location.search).get('user_id') || undefined,
    page_url: window.location.href,
  };
    console.log('[CodeTrack] Event tracked:', 'profile_page_viewed', eventData_profile_page_viewed);
    tracker.track('profile_page_viewed', eventData_profile_page_viewed);
  })();

    // User views their dashboard
  (() => {
    // Only fire on specific route: /dashboard
    if (window.location.pathname === '/dashboard' || window.location.pathname.startsWith('/dashboard/')) {
      const eventData_dashboard_page_viewed = {
    user_id: new URLSearchParams(window.location.search).get('user_id') || undefined,
    learning_level: new URLSearchParams(window.location.search).get('learning_level') || undefined,
    page_url: window.location.href,
  };
      console.log('[CodeTrack] Event tracked:', 'dashboard_page_viewed', eventData_dashboard_page_viewed);
      tracker.track('dashboard_page_viewed', eventData_dashboard_page_viewed);
    }
  })();

    // User views the assessment page
  (() => {
    const eventData_assessment_page_viewed = {
    user_id: new URLSearchParams(window.location.search).get('user_id') || undefined,
    page_url: window.location.href,
  };
    console.log('[CodeTrack] Event tracked:', 'assessment_page_viewed', eventData_assessment_page_viewed);
    tracker.track('assessment_page_viewed', eventData_assessment_page_viewed);
  })();

  // Route change listeners (for SPAs)
    // No auto-implemented route change events

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
    // Check for quick_quiz_restarted
  if (element.matches('[data-event="quick_quiz_restarted"], [data-action="quick-quiz-restarted"], button.quick-quiz-restarted, .quick-quiz-restarted-button')) {
    element.addEventListener('click', () => {
      tracker.track('quick_quiz_restarted', extractProperties(element));
    });
  }
  // Check for edit_profile_saved
  if (element.matches('[data-event="edit_profile_saved"], [data-action="edit-profile-saved"], button.edit-profile-saved, .edit-profile-saved-button')) {
    element.addEventListener('click', () => {
      tracker.track('edit_profile_saved', extractProperties(element));
    });
  }
  // Check for timed_challenge_answer_submitted
  if (element.matches('form[data-event="timed_challenge_answer_submitted"]')) {
    element.addEventListener('submit', () => {
      tracker.track('timed_challenge_answer_submitted', extractProperties(element));
    });
  }
  // Check for auth_page_viewed
  if (element.matches('form[data-event="auth_page_viewed"]')) {
    element.addEventListener('submit', () => {
      tracker.track('auth_page_viewed', extractProperties(element));
    });
  }
  // Check for setting_display_furigana_toggled
  if (element.matches('[data-event="setting_display_furigana_toggled"], [data-action="setting-display-furigana-toggled"], button.setting-display-furigana-toggled, .setting-display-furigana-toggled-button')) {
    element.addEventListener('click', () => {
      tracker.track('setting_display_furigana_toggled', extractProperties(element));
    });
  }
  // Check for setting_quiz_auto_advance_toggled
  if (element.matches('[data-event="setting_quiz_auto_advance_toggled"], [data-action="setting-quiz-auto-advance-toggled"], button.setting-quiz-auto-advance-toggled, .setting-quiz-auto-advance-toggled-button')) {
    element.addEventListener('click', () => {
      tracker.track('setting_quiz_auto_advance_toggled', extractProperties(element));
    });
  }
  // Check for setting_show_stroke_order_toggled
  if (element.matches('[data-event="setting_show_stroke_order_toggled"], [data-action="setting-show-stroke-order-toggled"], button.setting-show-stroke-order-toggled, .setting-show-stroke-order-toggled-button')) {
    element.addEventListener('click', () => {
      tracker.track('setting_show_stroke_order_toggled', extractProperties(element));
    });
  }
  // Check for button_clicked
  if (element.matches('[data-event="button_clicked"], [data-action="button"], button.button, .button-button')) {
    element.addEventListener('click', () => {
      tracker.track('button_clicked', extractProperties(element));
    });
  }
  // Check for signup_submitted
  if (element.matches('form[name="signup"], form#signup-form, form[data-form="signup"]')) {
    element.addEventListener('submit', () => {
      tracker.track('signup_submitted', extractProperties(element));
    });
  }
  // Check for login_submitted
  if (element.matches('form[name="login"], form#login-form, form[data-form="login"]')) {
    element.addEventListener('submit', () => {
      tracker.track('login_submitted', extractProperties(element));
    });
  }
  // Check for assessment_started
  if (element.matches('[data-event="assessment_started"], [data-action="assessment-started"], button.assessment-started, .assessment-started-button')) {
    element.addEventListener('click', () => {
      tracker.track('assessment_started', extractProperties(element));
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
 * User answers a question in the assessment
 * Priority: medium
 * 
 * Call this function when: User answers a question in the assessment
 * 
 * @example
 * trackAssessmentQuestionAnswered({ user_id: 'user_id_value', question_number: 'question_number_value', answer_selected: 'answer_selected_value', correct_answer_given: 'correct_answer_given_value' });
 */
export function trackAssessmentQuestionAnswered(properties: { user_id: string, question_number: string, answer_selected: string, correct_answer_given: string }): void {
  const eventData = {
    user_id: properties.user_id,
    question_number: properties.question_number,
    answer_selected: properties.answer_selected,
    correct_answer_given: properties.correct_answer_given,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'assessment_question_answered', eventData);
  tracker.track('assessment_question_answered', eventData);
}

/**
 * User resets a timed challenge
 * Priority: medium
 * 
 * Call this function when: User resets a timed challenge
 * 
 * @example
 * trackTimedChallengeReset({ user_id: 'user_id_value' });
 */
export function trackTimedChallengeReset(properties: { user_id: string }): void {
  const eventData = {
    user_id: properties.user_id,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'timed_challenge_reset', eventData);
  tracker.track('timed_challenge_reset', eventData);
}

/**
 * User views a specific Kana learning page
 * Priority: medium
 * 
 * Call this function when: User views a specific Kana learning page
 * 
 * @example
 * trackKanaLearningPageViewed({ user_id: 'user_id_value', kana_type: 'kana_type_value' });
 */
export function trackKanaLearningPageViewed(properties: { user_id: string, kana_type: string }): void {
  const eventData = {
    user_id: properties.user_id,
    kana_type: properties.kana_type,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'kana_learning_page_viewed', eventData);
  tracker.track('kana_learning_page_viewed', eventData);
}

/**
 * User requests a password reset
 * Priority: medium
 * 
 * Call this function when: User requests a password reset
 * 
 * @example
 * trackPasswordResetRequested({ email_used: 'email_used_value' });
 */
export function trackPasswordResetRequested(properties: { email_used: string }): void {
  const eventData = {
    email_used: properties.email_used,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'password_reset_requested', eventData);
  tracker.track('password_reset_requested', eventData);
}

/**
 * User views a page within the application
 * Priority: low
 * 
 * Call this function when: User views a page within the application
 * 
 * @example
 * trackPageViewed({ page_name: 'page_name_value', user_id: 'user_id_value' });
 */
export function trackPageViewed(properties: { page_name: string, user_id: string }): void {
  const eventData = {
    page_name: properties.page_name,
    user_id: properties.user_id,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'page_viewed', eventData);
  tracker.track('page_viewed', eventData);
}

/**
 * User navigates back from an assessment screen
 * Priority: low
 * 
 * Call this function when: User navigates back from an assessment screen
 * 
 * @example
 * trackAssessmentNavigatedBack({ user_id: 'user_id_value', current_question: 'current_question_value' });
 */
export function trackAssessmentNavigatedBack(properties: { user_id: string, current_question: string }): void {
  const eventData = {
    user_id: properties.user_id,
    current_question: properties.current_question,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'assessment_navigated_back', eventData);
  tracker.track('assessment_navigated_back', eventData);
}

/**
 * User completes the learning level assessment
 * Priority: high
 * 
 * Call this function when: User completes the learning level assessment
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
