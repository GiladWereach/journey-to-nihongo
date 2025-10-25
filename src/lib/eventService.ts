/**
 * Auto-generated Event Service
 * This file is generated automatically based on your tracking plan.
 * 
 * Auto-implemented events: 13
 * Manual events: 12
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
    // User restarted a quick quiz.
  setupClickListener('[data-event="quick_quiz_restarted"], [data-action="quick-quiz-restarted"], button.quick-quiz-restarted, .quick-quiz-restarted-button', (element) => {
    const eventData = {
      user_id: element.getAttribute('data-user-id') || undefined,
      page_url: window.location.href,
    };
    console.log('[CodeTrack] Event tracked:', 'quick_quiz_restarted', eventData);
    tracker.track('quick_quiz_restarted', eventData);
  });

    // User toggled a setting in their profile.
  setupClickListener('[data-event="edit_profile_settings_updated"], [data-action="edit-profile-settings-updated"], button.edit-profile-settings-updated, .edit-profile-settings-updated-button', (element) => {
    const eventData = {
      user_id: element.getAttribute('data-user-id') || undefined,
      setting_name: element.getAttribute('data-setting-name') || undefined,
      setting_value: element.getAttribute('data-setting-value') || undefined,
      page_url: window.location.href,
    };
    console.log('[CodeTrack] Event tracked:', 'edit_profile_settings_updated', eventData);
    tracker.track('edit_profile_settings_updated', eventData);
  });

    // User started a new learning path or lesson through the LearningPathSection.
  setupClickListener('[data-event="learning_path_started"], [data-action="learning-path-started"], button.learning-path-started, .learning-path-started-button', (element) => {
    const eventData = {
      user_id: element.getAttribute('data-user-id') || undefined,
      lesson_name: element.getAttribute('data-lesson-name') || undefined,
      lesson_type: element.getAttribute('data-lesson-type') || undefined,
      page_url: window.location.href,
    };
    console.log('[CodeTrack] Event tracked:', 'learning_path_started', eventData);
    tracker.track('learning_path_started', eventData);
  });

    // User clicked the save button in the edit profile section.
  setupClickListener('button[data-action="edit"], .edit-button, #edit-btn, button[aria-label*="edit" i]', (element) => {
    const eventData = {
      user_id: element.getAttribute('data-user-id') || undefined,
      changed_settings_count: element.getAttribute('data-changed-settings-count') || undefined,
      page_url: window.location.href,
    };
    console.log('[CodeTrack] Event tracked:', 'edit_profile_saved', eventData);
    tracker.track('edit_profile_saved', eventData);
  });

    // User started an assessment.
  setupClickListener('[data-event="assessment_started"], [data-action="assessment-started"], button.assessment-started, .assessment-started-button', (element) => {
    const eventData = {
      user_id: element.getAttribute('data-user-id') || undefined,
      page_url: window.location.href,
    };
    console.log('[CodeTrack] Event tracked:', 'assessment_started', eventData);
    tracker.track('assessment_started', eventData);
  });

    // User started a timed challenge.
  setupClickListener('[data-event="timed_challenge_started"], [data-action="timed-challenge-started"], button.timed-challenge-started, .timed-challenge-started-button', (element) => {
    const eventData = {
      user_id: element.getAttribute('data-user-id') || undefined,
      kana_type: element.getAttribute('data-kana-type') || undefined,
      page_url: window.location.href,
    };
    console.log('[CodeTrack] Event tracked:', 'timed_challenge_started', eventData);
    tracker.track('timed_challenge_started', eventData);
  });

  // Form submit listeners
    // User failed to log in.
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
      console.log('[CodeTrack] Event tracked:', 'login_failed', eventData);
      tracker.track('login_failed', eventData);
      // Submit form after tracking
      form.submit();
    }
  });

    // User initiated the signup process.
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
      console.log('[CodeTrack] Event tracked:', 'signup_started', eventData);
      tracker.track('signup_started', eventData);
      // Submit form after tracking
      form.submit();
    }
  });

    // User successfully created an account.
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

    // User successfully logged in.
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
      console.log('[CodeTrack] Event tracked:', 'login_succeeded', eventData);
      tracker.track('login_succeeded', eventData);
      // Submit form after tracking
      form.submit();
    }
  });

  // Page load events
    // No auto-implemented load events

  // Route change listeners (for SPAs)
    // User clicked on the Achievements navigation link.
  let lastPath = window.location.pathname;
  setInterval(() => {
    if (window.location.pathname !== lastPath) {
      const eventData = {
        page_url: window.location.href,
        page_path: window.location.pathname,
        from_path: lastPath,
      };
      console.log('[CodeTrack] Event tracked:', 'achievement_link_clicked', eventData);
      tracker.track('achievement_link_clicked', eventData);
      lastPath = window.location.pathname;
    }
  }, 100);

    // User clicked on a link to navigate to the Dashboard.
  let lastPath = window.location.pathname;
  setInterval(() => {
    if (window.location.pathname !== lastPath) {
      const eventData = {
        page_url: window.location.href,
        page_path: window.location.pathname,
        from_path: lastPath,
      };
      console.log('[CodeTrack] Event tracked:', 'dashboard_link_clicked', eventData);
      tracker.track('dashboard_link_clicked', eventData);
      lastPath = window.location.pathname;
    }
  }, 100);

    // User navigated to the dashboard after completing or interacting with the assessment.
  let lastPath = window.location.pathname;
  setInterval(() => {
    if (window.location.pathname !== lastPath) {
      const eventData = {
        page_url: window.location.href,
        page_path: window.location.pathname,
        from_path: lastPath,
      };
      console.log('[CodeTrack] Event tracked:', 'assessment_redirected_to_dashboard', eventData);
      tracker.track('assessment_redirected_to_dashboard', eventData);
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
    // Check for quick_quiz_restarted
  if (element.matches('[data-event="quick_quiz_restarted"], [data-action="quick-quiz-restarted"], button.quick-quiz-restarted, .quick-quiz-restarted-button')) {
    element.addEventListener('click', () => {
      tracker.track('quick_quiz_restarted', extractProperties(element));
    });
  }
  // Check for login_failed
  if (element.matches('form[name="login"], form#login-form, form[data-form="login"]')) {
    element.addEventListener('submit', () => {
      tracker.track('login_failed', extractProperties(element));
    });
  }
  // Check for edit_profile_settings_updated
  if (element.matches('[data-event="edit_profile_settings_updated"], [data-action="edit-profile-settings-updated"], button.edit-profile-settings-updated, .edit-profile-settings-updated-button')) {
    element.addEventListener('click', () => {
      tracker.track('edit_profile_settings_updated', extractProperties(element));
    });
  }
  // Check for learning_path_started
  if (element.matches('[data-event="learning_path_started"], [data-action="learning-path-started"], button.learning-path-started, .learning-path-started-button')) {
    element.addEventListener('click', () => {
      tracker.track('learning_path_started', extractProperties(element));
    });
  }
  // Check for edit_profile_saved
  if (element.matches('button[data-action="edit"], .edit-button, #edit-btn, button[aria-label*="edit" i]')) {
    element.addEventListener('click', () => {
      tracker.track('edit_profile_saved', extractProperties(element));
    });
  }
  // Check for assessment_started
  if (element.matches('[data-event="assessment_started"], [data-action="assessment-started"], button.assessment-started, .assessment-started-button')) {
    element.addEventListener('click', () => {
      tracker.track('assessment_started', extractProperties(element));
    });
  }
  // Check for signup_started
  if (element.matches('form[name="signup"], form#signup-form, form[data-form="signup"]')) {
    element.addEventListener('submit', () => {
      tracker.track('signup_started', extractProperties(element));
    });
  }
  // Check for signup_completed
  if (element.matches('form[name="signup"], form#signup-form, form[data-form="signup"]')) {
    element.addEventListener('submit', () => {
      tracker.track('signup_completed', extractProperties(element));
    });
  }
  // Check for login_succeeded
  if (element.matches('form[name="login"], form#login-form, form[data-form="login"]')) {
    element.addEventListener('submit', () => {
      tracker.track('login_succeeded', extractProperties(element));
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
 * Tracks all page views with the page name as a property. This consolidates multiple page view events into one to reduce event volume and increase flexibility.
 * Priority: medium
 * 
 * Call this function when: Tracks all page views with the page name as a property. This consolidates multiple page view events into one to reduce event volume and increase flexibility.
 * 
 * @example
 * trackPageViewed({ page_name: 'page_name_value', user_id: 'user_id_value', user_plan: 'user_plan_value' });
 */
export function trackPageViewed(properties: { page_name: string, user_id: string, user_plan: string }): void {
  const eventData = {
    page_name: properties.page_name,
    user_id: properties.user_id,
    user_plan: properties.user_plan,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'page_viewed', eventData);
  tracker.track('page_viewed', eventData);
}

/**
 * User reset a timed challenge.
 * Priority: medium
 * 
 * Call this function when: User reset a timed challenge.
 * 
 * @example
 * trackTimedChallengeReset({ user_id: 'user_id_value', kana_type: 'kana_type_value' });
 */
export function trackTimedChallengeReset(properties: { user_id: string, kana_type: string }): void {
  const eventData = {
    user_id: properties.user_id,
    kana_type: properties.kana_type,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'timed_challenge_reset', eventData);
  tracker.track('timed_challenge_reset', eventData);
}

/**
 * User advanced through a learning path.
 * Priority: medium
 * 
 * Call this function when: User advanced through a learning path.
 * 
 * @example
 * trackLearningPathProgressed({ user_id: 'user_id_value', lesson_name: 'lesson_name_value', progress_percentage: 'progress_percentage_value' });
 */
export function trackLearningPathProgressed(properties: { user_id: string, lesson_name: string, progress_percentage: string }): void {
  const eventData = {
    user_id: properties.user_id,
    lesson_name: properties.lesson_name,
    progress_percentage: properties.progress_percentage,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'learning_path_progressed', eventData);
  tracker.track('learning_path_progressed', eventData);
}

/**
 * User answered a question in a timed challenge.
 * Priority: medium
 * 
 * Call this function when: User answered a question in a timed challenge.
 * 
 * @example
 * trackTimedChallengeQuestionAnswered({ user_id: 'user_id_value', kana_type: 'kana_type_value', question_text: 'question_text_value', answer_provided: 'answer_provided_value', is_correct: 'is_correct_value' });
 */
export function trackTimedChallengeQuestionAnswered(properties: { user_id: string, kana_type: string, question_text: string, answer_provided: string, is_correct: string }): void {
  const eventData = {
    user_id: properties.user_id,
    kana_type: properties.kana_type,
    question_text: properties.question_text,
    answer_provided: properties.answer_provided,
    is_correct: properties.is_correct,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'timed_challenge_question_answered', eventData);
  tracker.track('timed_challenge_question_answered', eventData);
}

/**
 * User returned to home from quick quiz.
 * Priority: medium
 * 
 * Call this function when: User returned to home from quick quiz.
 * 
 * @example
 * trackQuickQuizReturnedHome({ user_id: 'user_id_value' });
 */
export function trackQuickQuizReturnedHome(properties: { user_id: string }): void {
  const eventData = {
    user_id: properties.user_id,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'quick_quiz_returned_home', eventData);
  tracker.track('quick_quiz_returned_home', eventData);
}

/**
 * User logged out of their account.
 * Priority: medium
 * 
 * Call this function when: User logged out of their account.
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
 * User initiated a password reset request.
 * Priority: medium
 * 
 * Call this function when: User initiated a password reset request.
 * 
 * @example
 * trackPasswordResetRequested({ user_id: 'user_id_value' });
 */
export function trackPasswordResetRequested(properties: { user_id: string }): void {
  const eventData = {
    user_id: properties.user_id,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'password_reset_requested', eventData);
  tracker.track('password_reset_requested', eventData);
}

/**
 * User answered a question in the assessment.
 * Priority: medium
 * 
 * Call this function when: User answered a question in the assessment.
 * 
 * @example
 * trackAssessmentQuestionAnswered({ user_id: 'user_id_value', question_index: 'question_index_value', answer_value: 'answer_value_value', correct_answer: 'correct_answer_value' });
 */
export function trackAssessmentQuestionAnswered(properties: { user_id: string, question_index: string, answer_value: string, correct_answer: string }): void {
  const eventData = {
    user_id: properties.user_id,
    question_index: properties.question_index,
    answer_value: properties.answer_value,
    correct_answer: properties.correct_answer,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'assessment_question_answered', eventData);
  tracker.track('assessment_question_answered', eventData);
}

/**
 * User completed an assessment.
 * Priority: high
 * 
 * Call this function when: User completed an assessment.
 * 
 * @example
 * trackAssessmentCompleted({ user_id: 'user_id_value', score: 'score_value', percentage: 'percentage_value', learning_level_set: 'learning_level_set_value' });
 */
export function trackAssessmentCompleted(properties: { user_id: string, score: string, percentage: string, learning_level_set: string }): void {
  const eventData = {
    user_id: properties.user_id,
    score: properties.score,
    percentage: properties.percentage,
    learning_level_set: properties.learning_level_set,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'assessment_completed', eventData);
  tracker.track('assessment_completed', eventData);
}

/**
 * User completed a timed challenge, either by finishing or navigating away.
 * Priority: high
 * 
 * Call this function when: User completed a timed challenge, either by finishing or navigating away.
 * 
 * @example
 * trackTimedChallengeCompleted({ user_id: 'user_id_value', kana_type: 'kana_type_value', score: 'score_value' });
 */
export function trackTimedChallengeCompleted(properties: { user_id: string, kana_type: string, score: string }): void {
  const eventData = {
    user_id: properties.user_id,
    kana_type: properties.kana_type,
    score: properties.score,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'timed_challenge_completed', eventData);
  tracker.track('timed_challenge_completed', eventData);
}

/**
 * User completed a writing practice session.
 * Priority: high
 * 
 * Call this function when: User completed a writing practice session.
 * 
 * @example
 * trackWritingPracticeCompleted({ user_id: 'user_id_value', kana_type: 'kana_type_value', strokes_drawn: 'strokes_drawn_value', accuracy_score: 'accuracy_score_value' });
 */
export function trackWritingPracticeCompleted(properties: { user_id: string, kana_type: string, strokes_drawn: string, accuracy_score: string }): void {
  const eventData = {
    user_id: properties.user_id,
    kana_type: properties.kana_type,
    strokes_drawn: properties.strokes_drawn,
    accuracy_score: properties.accuracy_score,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'writing_practice_completed', eventData);
  tracker.track('writing_practice_completed', eventData);
}

/**
 * User successfully reset their password.
 * Priority: high
 * 
 * Call this function when: User successfully reset their password.
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
