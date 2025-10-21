/**
 * Auto-generated Event Service
 * This file is generated automatically based on your tracking plan.
 * 
 * Auto-implemented events: 7
 * Manual events: 8
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
    // User started a timed challenge quiz
  setupClickListener('[data-event="timed_challenge_started"], [data-action="timed-challenge-started"], button.timed-challenge-started, .timed-challenge-started-button', (element) => {
    const eventData = {
      user_id: element.getAttribute('data-user-id') || undefined,
      kana_type: element.getAttribute('data-kana-type') || undefined,
      difficulty: element.getAttribute('data-difficulty') || undefined,
      time_limit_seconds: element.getAttribute('data-time-limit-seconds') || undefined,
      page_url: window.location.href,
    };
    console.log('[CodeTrack] Event tracked:', 'timed_challenge_started', eventData);
    tracker.track('timed_challenge_started', eventData);
  });

    // User started a writing practice session for a specific kana type
  setupClickListener('[data-event="writing_practice_started"], [data-action="writing-practice-started"], button.writing-practice-started, .writing-practice-started-button', (element) => {
    const eventData = {
      user_id: element.getAttribute('data-user-id') || undefined,
      kana_type: element.getAttribute('data-kana-type') || undefined,
      page_url: window.location.href,
    };
    console.log('[CodeTrack] Event tracked:', 'writing_practice_started', eventData);
    tracker.track('writing_practice_started', eventData);
  });

    // User clicked on a learning path card on the Learn page
  setupClickListener('[data-event="learning_path_card_clicked"], [data-action="learning-path-card"], button.learning-path-card, .learning-path-card-button', (element) => {
    const eventData = {
      user_id: element.getAttribute('data-user-id') || undefined,
      path_title: element.getAttribute('data-path-title') || undefined,
      page_destination: element.getAttribute('data-page-destination') || undefined,
      page_url: window.location.href,
    };
    console.log('[CodeTrack] Event tracked:', 'learning_path_card_clicked', eventData);
    tracker.track('learning_path_card_clicked', eventData);
  });

    // User started a new quiz session
  setupClickListener('[data-event="quiz_session_started"], [data-action="quiz-session-started"], button.quiz-session-started, .quiz-session-started-button', (element) => {
    const eventData = {
      user_id: element.getAttribute('data-user-id') || undefined,
      session_id: element.getAttribute('data-session-id') || undefined,
      kana_type: element.getAttribute('data-kana-type') || undefined,
      page_url: window.location.href,
    };
    console.log('[CodeTrack] Event tracked:', 'quiz_session_started', eventData);
    tracker.track('quiz_session_started', eventData);
  });

  // Form submit listeners
    // User updated their profile information and/or settings
  document.addEventListener('submit', (e) => {
    const form = e.target as HTMLFormElement;
    if (form.matches('form[data-event="profile_updated"]')) {
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
      console.log('[CodeTrack] Event tracked:', 'profile_updated', eventData);
      tracker.track('profile_updated', eventData);
      // Submit form after tracking
      form.submit();
    }
  });

    // User successfully signed up for an account
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

    // User successfully logged in to their account
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

  // Page load events
    // No auto-implemented load events

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
    // Check for timed_challenge_started
  if (element.matches('[data-event="timed_challenge_started"], [data-action="timed-challenge-started"], button.timed-challenge-started, .timed-challenge-started-button')) {
    element.addEventListener('click', () => {
      tracker.track('timed_challenge_started', extractProperties(element));
    });
  }
  // Check for profile_updated
  if (element.matches('form[data-event="profile_updated"]')) {
    element.addEventListener('submit', () => {
      tracker.track('profile_updated', extractProperties(element));
    });
  }
  // Check for writing_practice_started
  if (element.matches('[data-event="writing_practice_started"], [data-action="writing-practice-started"], button.writing-practice-started, .writing-practice-started-button')) {
    element.addEventListener('click', () => {
      tracker.track('writing_practice_started', extractProperties(element));
    });
  }
  // Check for learning_path_card_clicked
  if (element.matches('[data-event="learning_path_card_clicked"], [data-action="learning-path-card"], button.learning-path-card, .learning-path-card-button')) {
    element.addEventListener('click', () => {
      tracker.track('learning_path_card_clicked', extractProperties(element));
    });
  }
  // Check for quiz_session_started
  if (element.matches('[data-event="quiz_session_started"], [data-action="quiz-session-started"], button.quiz-session-started, .quiz-session-started-button')) {
    element.addEventListener('click', () => {
      tracker.track('quiz_session_started', extractProperties(element));
    });
  }
  // Check for signup_completed
  if (element.matches('form[name="signup"], form#signup-form, form[data-form="signup"]')) {
    element.addEventListener('submit', () => {
      tracker.track('signup_completed', extractProperties(element));
    });
  }
  // Check for login_completed
  if (element.matches('form[name="login"], form#login-form, form[data-form="login"]')) {
    element.addEventListener('submit', () => {
      tracker.track('login_completed', extractProperties(element));
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
 * User requested to reset their password
 * Priority: medium
 * 
 * Call this function when: User requested to reset their password
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
 * User completed a writing practice session for a specific kana type
 * Priority: medium
 * 
 * Call this function when: User completed a writing practice session for a specific kana type
 * 
 * @example
 * trackWritingPracticeCompleted({ user_id: 'user_id_value', kana_type: 'kana_type_value', duration_seconds: 'duration_seconds_value', characters_practiced: 'characters_practiced_value' });
 */
export function trackWritingPracticeCompleted(properties: { user_id: string, kana_type: string, duration_seconds: string, characters_practiced: string }): void {
  const eventData = {
    user_id: properties.user_id,
    kana_type: properties.kana_type,
    duration_seconds: properties.duration_seconds,
    characters_practiced: properties.characters_practiced,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'writing_practice_completed', eventData);
  tracker.track('writing_practice_completed', eventData);
}

/**
 * User logged out of their account
 * Priority: medium
 * 
 * Call this function when: User logged out of their account
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
 * User's mastery level for a specific kana character changed
 * Priority: low
 * 
 * Call this function when: User's mastery level for a specific kana character changed
 * 
 * @example
 * trackKanaMasteryLevelChanged({ user_id: 'user_id_value', character_id: 'character_id_value', kana: 'kana_value', romaji: 'romaji_value', previous_mastery_level: 'previous_mastery_level_value', new_mastery_level: 'new_mastery_level_value' });
 */
export function trackKanaMasteryLevelChanged(properties: { user_id: string, character_id: string, kana: string, romaji: string, previous_mastery_level: string, new_mastery_level: string }): void {
  const eventData = {
    user_id: properties.user_id,
    character_id: properties.character_id,
    kana: properties.kana,
    romaji: properties.romaji,
    previous_mastery_level: properties.previous_mastery_level,
    new_mastery_level: properties.new_mastery_level,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'kana_mastery_level_changed', eventData);
  tracker.track('kana_mastery_level_changed', eventData);
}

/**
 * User completed the initial learning assessment
 * Priority: high
 * 
 * Call this function when: User completed the initial learning assessment
 * 
 * @example
 * trackAssessmentCompleted({ user_id: 'user_id_value', score: 'score_value', percentage: 'percentage_value', determined_learning_level: 'determined_learning_level_value' });
 */
export function trackAssessmentCompleted(properties: { user_id: string, score: string, percentage: string, determined_learning_level: string }): void {
  const eventData = {
    user_id: properties.user_id,
    score: properties.score,
    percentage: properties.percentage,
    determined_learning_level: properties.determined_learning_level,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'assessment_completed', eventData);
  tracker.track('assessment_completed', eventData);
}

/**
 * User viewed a page
 * Priority: high
 * 
 * Call this function when: User viewed a page
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
 * User completed or abandoned a quiz session
 * Priority: high
 * 
 * Call this function when: User completed or abandoned a quiz session
 * 
 * @example
 * trackQuizSessionEnded({ user_id: 'user_id_value', session_id: 'session_id_value', kana_type: 'kana_type_value', questions_attempted: 'questions_attempted_value', correct_answers: 'correct_answers_value', accuracy: 'accuracy_value', session_duration_seconds: 'session_duration_seconds_value' });
 */
export function trackQuizSessionEnded(properties: { user_id: string, session_id: string, kana_type: string, questions_attempted: string, correct_answers: string, accuracy: string, session_duration_seconds: string }): void {
  const eventData = {
    user_id: properties.user_id,
    session_id: properties.session_id,
    kana_type: properties.kana_type,
    questions_attempted: properties.questions_attempted,
    correct_answers: properties.correct_answers,
    accuracy: properties.accuracy,
    session_duration_seconds: properties.session_duration_seconds,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'quiz_session_ended', eventData);
  tracker.track('quiz_session_ended', eventData);
}

/**
 * User completed a timed challenge quiz
 * Priority: high
 * 
 * Call this function when: User completed a timed challenge quiz
 * 
 * @example
 * trackTimedChallengeCompleted({ user_id: 'user_id_value', kana_type: 'kana_type_value', difficulty: 'difficulty_value', score: 'score_value', time_remaining_seconds: 'time_remaining_seconds_value', accuracy: 'accuracy_value', total_questions: 'total_questions_value' });
 */
export function trackTimedChallengeCompleted(properties: { user_id: string, kana_type: string, difficulty: string, score: string, time_remaining_seconds: string, accuracy: string, total_questions: string }): void {
  const eventData = {
    user_id: properties.user_id,
    kana_type: properties.kana_type,
    difficulty: properties.difficulty,
    score: properties.score,
    time_remaining_seconds: properties.time_remaining_seconds,
    accuracy: properties.accuracy,
    total_questions: properties.total_questions,
    page_url: window.location.href,
  };
  console.log('[CodeTrack] Event tracked:', 'timed_challenge_completed', eventData);
  tracker.track('timed_challenge_completed', eventData);
}
