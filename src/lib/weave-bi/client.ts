import type { WeaveConfig, WeaveEvent, WeaveContext, EventConfig } from './types';
import { EventQueue } from './queue';
import { getSessionId } from './session';

export class WeaveClient {
  private config: Required<WeaveConfig>;
  private context: WeaveContext = {};
  private queue: EventQueue | null = null;
  private userId?: string;
  private eventConfigs: EventConfig[] = [];

  constructor(config: WeaveConfig) {
    this.config = {
      debug: false,
      batchSize: 10,
      flushInterval: 5000,
      autoPageViews: false,
      autoErrorTracking: false,
      autoClickTracking: false,
      autoFormTracking: false,
      events: [],
      ...config,
    };

    this.eventConfigs = this.config.events || [];
    this.initialize();
  }

  private initialize(): void {
    if (this.config.debug) {
      console.log('[Weave BI] Initializing with config:', this.config);
      console.log('[Weave BI] Event configs:', this.eventConfigs.length);
    }

    this.queue = new EventQueue(
      this.config.apiEndpoint,
      this.config.projectId,
      this.config.batchSize,
      this.config.flushInterval,
      this.config.debug
    );

    if (typeof window !== 'undefined') {
      if (this.config.autoPageViews) {
        this.setupPageViewTracking();
      }

      if (this.config.autoErrorTracking) {
        this.setupErrorTracking();
      }

      if (this.config.autoClickTracking) {
        this.setupClickTracking();
      }

      if (this.config.autoFormTracking) {
        this.setupFormTracking();
      }

      window.addEventListener('beforeunload', () => {
        this.flush();
      });
    }
  }

  track(eventName: string, properties: Record<string, any> = {}): void {
    const event: WeaveEvent = {
      event_name: eventName,
      properties: {
        ...this.context,
        ...properties,
      },
      timestamp: new Date().toISOString(),
      user_id: this.userId,
      session_id: getSessionId(),
      sdk_version: '1.0.0',
    };

    if (typeof window !== 'undefined') {
      event.page_url = window.location.href;
      event.referrer = document.referrer;
      event.user_agent = navigator.userAgent;
    }

    if (this.config.debug) {
      console.log('[Weave BI] Track:', eventName, properties);
    }

    this.queue?.enqueue(event);
  }

  identify(userId: string, traits?: Record<string, any>): void {
    this.userId = userId;

    if (traits) {
      this.context = { ...this.context, ...traits };
    }

    this.track('user_identified', { user_id: userId, ...traits });
  }

  setContext(context: Record<string, any>): void {
    this.context = { ...this.context, ...context };
  }

  reset(): void {
    this.userId = undefined;
    this.context = {};
  }

  async flush(): Promise<void> {
    await this.queue?.flush();
  }

  private setupPageViewTracking(): void {
    if (typeof window === 'undefined') return;

    this.track('page_viewed', {
      page_path: window.location.pathname,
      page_title: document.title,
    });

    const trackPageView = () => {
      this.track('page_viewed', {
        page_path: window.location.pathname,
        page_title: document.title,
      });
    };

    let currentPath = window.location.pathname;

    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        trackPageView();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('popstate', trackPageView);
  }

  private setupErrorTracking(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', (event) => {
      this.track('error_occurred', {
        error_message: event.message,
        error_stack: event.error?.stack,
        error_filename: event.filename,
        error_line: event.lineno,
        error_column: event.colno,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.track('error_occurred', {
        error_message: event.reason?.message || 'Unhandled Promise Rejection',
        error_stack: event.reason?.stack,
        error_type: 'promise_rejection',
      });
    });
  }

  private setupClickTracking(): void {
    if (typeof window === 'undefined') return;

    const clickEvents = this.eventConfigs.filter(e => e.trigger === 'click');

    if (clickEvents.length === 0) {
      if (this.config.debug) {
        console.log('[Weave BI] No click events configured for auto-tracking');
      }
      return;
    }

    if (this.config.debug) {
      console.log('[Weave BI] Setting up auto-tracking for', clickEvents.length, 'click events');
    }

    // Use event delegation for performance
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Check each configured event
      for (const eventConfig of clickEvents) {
        try {
          // Check if target or any parent matches the selector
          const matchedElement = target.closest(eventConfig.selector);
          if (matchedElement) {
            const element = matchedElement as HTMLElement;

            // Extract useful properties from the element
            const properties: Record<string, any> = {
              element_text: element.textContent?.trim() || '',
              element_id: element.id || undefined,
              element_class: element.className || undefined,
              element_tag: element.tagName?.toLowerCase(),
            };

            // Add data attributes
            const dataAttrs = element.dataset;
            if (dataAttrs && Object.keys(dataAttrs).length > 0) {
              properties.element_data = dataAttrs;
            }

            if (this.config.debug) {
              console.log('[Weave BI] Auto-tracked click:', eventConfig.event_name, properties);
            }

            this.track(eventConfig.event_name, properties);
            break; // Only track once per click
          }
        } catch (err) {
          if (this.config.debug) {
            console.warn('[Weave BI] Error matching selector:', eventConfig.selector, err);
          }
        }
      }
    }, true); // Use capture phase to catch events early
  }

  private setupFormTracking(): void {
    if (typeof window === 'undefined') return;

    const formEvents = this.eventConfigs.filter(e => e.trigger === 'submit');

    if (formEvents.length === 0) {
      if (this.config.debug) {
        console.log('[Weave BI] No form submit events configured for auto-tracking');
      }
      return;
    }

    if (this.config.debug) {
      console.log('[Weave BI] Setting up auto-tracking for', formEvents.length, 'form submit events');
    }

    // Use event delegation for forms
    document.addEventListener('submit', (e) => {
      const target = e.target as HTMLFormElement;
      if (!target) return;

      // Check each configured event
      for (const eventConfig of formEvents) {
        try {
          if (target.matches(eventConfig.selector)) {
            // Extract form properties
            const properties: Record<string, any> = {
              form_id: target.id || undefined,
              form_name: target.name || undefined,
              form_action: target.action || undefined,
              form_method: target.method || undefined,
            };

            // Count form fields
            const formData = new FormData(target);
            properties.field_count = Array.from(formData.keys()).length;

            if (this.config.debug) {
              console.log('[Weave BI] Auto-tracked form submit:', eventConfig.event_name, properties);
            }

            this.track(eventConfig.event_name, properties);
            break; // Only track once per submit
          }
        } catch (err) {
          if (this.config.debug) {
            console.warn('[Weave BI] Error matching form selector:', eventConfig.selector, err);
          }
        }
      }
    }, true); // Use capture phase
  }
}
