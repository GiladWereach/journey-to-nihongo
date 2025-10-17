/**
 * Auto-generated Event Service
 * This file is generated automatically based on your tracking plan.
 * 
 * Auto-implemented events: 0
 * Manual events: 25
 */

import type { CodeTrackClient } from './client';

let tracker: CodeTrackClient;
let observer: MutationObserver | null = null;

/**
 * Initialize the event service with auto-tracking
 */
export function initEventService(trackingInstance: CodeTrackClient): void {
  tracker = trackingInstance;
  
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
  // Click event listeners
    // No auto-implemented click events

  // Form submit listeners
    // No auto-implemented submit events

  // Page load events
    // No auto-implemented load events

  // Route change listeners (for SPAs)
    // No auto-implemented route change events

  // Setup mutation observer for dynamically added elements
  setupMutationObserver();
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
    // No selectors to attach
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
 * User performed a search
 * Priority: medium
 * 
 * Call this function when: User performed a search
 * 
 * @example
 * trackSearchPerformed({ undefined: 'value', undefined: 'value' });
 */
export function trackSearchPerformed(properties: { undefined: any, undefined: any }): void {
  tracker.track('search_performed', {
    undefined: properties.undefined,
    undefined: properties.undefined,
    page_url: window.location.href,
  });
}

/**
 * User started a quiz
 * Priority: medium
 * 
 * Call this function when: User started a quiz
 * 
 * @example
 * trackQuizStarted({ undefined: 'value', undefined: 'value' });
 */
export function trackQuizStarted(properties: { undefined: any, undefined: any }): void {
  tracker.track('quiz_started', {
    undefined: properties.undefined,
    undefined: properties.undefined,
    page_url: window.location.href,
  });
}

/**
 * User accessed a premium feature
 * Priority: medium
 * 
 * Call this function when: User accessed a premium feature
 * 
 * @example
 * trackPremiumFeatureAccessed({ undefined: 'value' });
 */
export function trackPremiumFeatureAccessed(properties: { undefined: any }): void {
  tracker.track('premium_feature_accessed', {
    undefined: properties.undefined,
    page_url: window.location.href,
  });
}

/**
 * User unlocked an achievement
 * Priority: medium
 * 
 * Call this function when: User unlocked an achievement
 * 
 * @example
 * trackAchievementUnlocked({ undefined: 'value' });
 */
export function trackAchievementUnlocked(properties: { undefined: any }): void {
  tracker.track('achievement_unlocked', {
    undefined: properties.undefined,
    page_url: window.location.href,
  });
}

/**
 * User started a lesson
 * Priority: medium
 * 
 * Call this function when: User started a lesson
 * 
 * @example
 * trackLessonStarted({ undefined: 'value', undefined: 'value' });
 */
export function trackLessonStarted(properties: { undefined: any, undefined: any }): void {
  tracker.track('lesson_started', {
    undefined: properties.undefined,
    undefined: properties.undefined,
    page_url: window.location.href,
  });
}

/**
 * User submitted feedback
 * Priority: medium
 * 
 * Call this function when: User submitted feedback
 * 
 * @example
 * trackFeedbackSubmitted({ undefined: 'value', undefined: 'value' });
 */
export function trackFeedbackSubmitted(properties: { undefined: any, undefined: any }): void {
  tracker.track('feedback_submitted', {
    undefined: properties.undefined,
    undefined: properties.undefined,
    page_url: window.location.href,
  });
}

/**
 * User accessed a flashcard deck
 * Priority: medium
 * 
 * Call this function when: User accessed a flashcard deck
 * 
 * @example
 * trackFlashcardDeckAccessed({ undefined: 'value', undefined: 'value' });
 */
export function trackFlashcardDeckAccessed(properties: { undefined: any, undefined: any }): void {
  tracker.track('flashcard_deck_accessed', {
    undefined: properties.undefined,
    undefined: properties.undefined,
    page_url: window.location.href,
  });
}

/**
 * User studied a flashcard
 * Priority: medium
 * 
 * Call this function when: User studied a flashcard
 * 
 * @example
 * trackFlashcardStudied({ undefined: 'value', undefined: 'value', undefined: 'value' });
 */
export function trackFlashcardStudied(properties: { undefined: any, undefined: any, undefined: any }): void {
  tracker.track('flashcard_studied', {
    undefined: properties.undefined,
    undefined: properties.undefined,
    undefined: properties.undefined,
    page_url: window.location.href,
  });
}

/**
 * User maintained a learning streak
 * Priority: medium
 * 
 * Call this function when: User maintained a learning streak
 * 
 * @example
 * trackStreakMaintained({ undefined: 'value' });
 */
export function trackStreakMaintained(properties: { undefined: any }): void {
  tracker.track('streak_maintained', {
    undefined: properties.undefined,
    page_url: window.location.href,
  });
}

/**
 * User initiated the signup process
 * Priority: medium
 * 
 * Call this function when: User initiated the signup process
 * 
 * @example
 * trackSignupStarted({ undefined: 'value' });
 */
export function trackSignupStarted(properties: { undefined: any }): void {
  tracker.track('signup_started', {
    undefined: properties.undefined,
    page_url: window.location.href,
  });
}

/**
 * User shared content (e.g., quiz results, lesson progress)
 * Priority: medium
 * 
 * Call this function when: User shared content (e.g., quiz results, lesson progress)
 * 
 * @example
 * trackContentShared({ undefined: 'value', undefined: 'value', undefined: 'value' });
 */
export function trackContentShared(properties: { undefined: any, undefined: any, undefined: any }): void {
  tracker.track('content_shared', {
    undefined: properties.undefined,
    undefined: properties.undefined,
    undefined: properties.undefined,
    page_url: window.location.href,
  });
}

/**
 * User viewed an advertisement (if applicable)
 * Priority: low
 * 
 * Call this function when: User viewed an advertisement (if applicable)
 * 
 * @example
 * trackAdViewed({ undefined: 'value', undefined: 'value' });
 */
export function trackAdViewed(properties: { undefined: any, undefined: any }): void {
  tracker.track('ad_viewed', {
    undefined: properties.undefined,
    undefined: properties.undefined,
    page_url: window.location.href,
  });
}

/**
 * User logged out
 * Priority: low
 * 
 * Call this function when: User logged out
 * 
 * @example
 * trackLogoutCompleted({ undefined: 'value' });
 */
export function trackLogoutCompleted(properties: { undefined: any }): void {
  tracker.track('logout_completed', {
    undefined: properties.undefined,
    page_url: window.location.href,
  });
}

/**
 * User updated their profile
 * Priority: low
 * 
 * Call this function when: User updated their profile
 * 
 * @example
 * trackProfileUpdated({ undefined: 'value', undefined: 'value' });
 */
export function trackProfileUpdated(properties: { undefined: any, undefined: any }): void {
  tracker.track('profile_updated', {
    undefined: properties.undefined,
    undefined: properties.undefined,
    page_url: window.location.href,
  });
}

/**
 * User updated application settings
 * Priority: low
 * 
 * Call this function when: User updated application settings
 * 
 * @example
 * trackSettingsUpdated({ undefined: 'value', undefined: 'value', undefined: 'value' });
 */
export function trackSettingsUpdated(properties: { undefined: any, undefined: any, undefined: any }): void {
  tracker.track('settings_updated', {
    undefined: properties.undefined,
    undefined: properties.undefined,
    undefined: properties.undefined,
    page_url: window.location.href,
  });
}

/**
 * User viewed a page
 * Priority: low
 * 
 * Call this function when: User viewed a page
 * 
 * @example
 * trackPageViewed({ undefined: 'value', undefined: 'value', undefined: 'value' });
 */
export function trackPageViewed(properties: { undefined: any, undefined: any, undefined: any }): void {
  tracker.track('page_viewed', {
    undefined: properties.undefined,
    undefined: properties.undefined,
    undefined: properties.undefined,
    page_url: window.location.href,
  });
}

/**
 * User successfully signed up
 * Priority: high
 * 
 * Call this function when: User successfully signed up
 * 
 * @example
 * trackSignupCompleted({ undefined: 'value', undefined: 'value' });
 */
export function trackSignupCompleted(properties: { undefined: any, undefined: any }): void {
  tracker.track('signup_completed', {
    undefined: properties.undefined,
    undefined: properties.undefined,
    page_url: window.location.href,
  });
}

/**
 * User completed a lesson
 * Priority: high
 * 
 * Call this function when: User completed a lesson
 * 
 * @example
 * trackLessonCompleted({ undefined: 'value' });
 */
export function trackLessonCompleted(properties: { undefined: any }): void {
  tracker.track('lesson_completed', {
    undefined: properties.undefined,
    page_url: window.location.href,
  });
}

/**
 * User completed a quiz
 * Priority: high
 * 
 * Call this function when: User completed a quiz
 * 
 * @example
 * trackQuizCompleted({ undefined: 'value', undefined: 'value', undefined: 'value' });
 */
export function trackQuizCompleted(properties: { undefined: any, undefined: any, undefined: any }): void {
  tracker.track('quiz_completed', {
    undefined: properties.undefined,
    undefined: properties.undefined,
    undefined: properties.undefined,
    page_url: window.location.href,
  });
}

/**
 * User answered a question in a quiz
 * Priority: high
 * 
 * Call this function when: User answered a question in a quiz
 * 
 * @example
 * trackQuestionAnswered({ undefined: 'value', undefined: 'value', undefined: 'value', undefined: 'value' });
 */
export function trackQuestionAnswered(properties: { undefined: any, undefined: any, undefined: any, undefined: any }): void {
  tracker.track('question_answered', {
    undefined: properties.undefined,
    undefined: properties.undefined,
    undefined: properties.undefined,
    undefined: properties.undefined,
    page_url: window.location.href,
  });
}

/**
 * User started a premium subscription
 * Priority: high
 * 
 * Call this function when: User started a premium subscription
 * 
 * @example
 * trackSubscriptionStarted({ undefined: 'value', undefined: 'value', undefined: 'value' });
 */
export function trackSubscriptionStarted(properties: { undefined: any, undefined: any, undefined: any }): void {
  tracker.track('subscription_started', {
    undefined: properties.undefined,
    undefined: properties.undefined,
    undefined: properties.undefined,
    page_url: window.location.href,
  });
}

/**
 * User renewed their premium subscription
 * Priority: high
 * 
 * Call this function when: User renewed their premium subscription
 * 
 * @example
 * trackSubscriptionRenewed({ undefined: 'value', undefined: 'value', undefined: 'value' });
 */
export function trackSubscriptionRenewed(properties: { undefined: any, undefined: any, undefined: any }): void {
  tracker.track('subscription_renewed', {
    undefined: properties.undefined,
    undefined: properties.undefined,
    undefined: properties.undefined,
    page_url: window.location.href,
  });
}

/**
 * User cancelled their premium subscription
 * Priority: high
 * 
 * Call this function when: User cancelled their premium subscription
 * 
 * @example
 * trackSubscriptionCancelled({ undefined: 'value' });
 */
export function trackSubscriptionCancelled(properties: { undefined: any }): void {
  tracker.track('subscription_cancelled', {
    undefined: properties.undefined,
    page_url: window.location.href,
  });
}

/**
 * User made a purchase (e.g., in-app purchase for content)
 * Priority: high
 * 
 * Call this function when: User made a purchase (e.g., in-app purchase for content)
 * 
 * @example
 * trackPurchaseMade({ undefined: 'value', undefined: 'value', undefined: 'value' });
 */
export function trackPurchaseMade(properties: { undefined: any, undefined: any, undefined: any }): void {
  tracker.track('purchase_made', {
    undefined: properties.undefined,
    undefined: properties.undefined,
    undefined: properties.undefined,
    page_url: window.location.href,
  });
}

/**
 * User successfully logged in
 * Priority: high
 * 
 * Call this function when: User successfully logged in
 * 
 * @example
 * trackLoginSuccessful({ undefined: 'value', undefined: 'value' });
 */
export function trackLoginSuccessful(properties: { undefined: any, undefined: any }): void {
  tracker.track('login_successful', {
    undefined: properties.undefined,
    undefined: properties.undefined,
    page_url: window.location.href,
  });
}
