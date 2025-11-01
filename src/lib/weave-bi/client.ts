import type { WeaveConfig, WeaveEvent, WeaveContext } from './types';
import { EventQueue } from './queue';
import { getSessionId } from './session';

export class WeaveClient {
  private config: Required<WeaveConfig>;
  private context: WeaveContext = {};
  private queue: EventQueue | null = null;
  private userId?: string;

  constructor(config: WeaveConfig) {
    this.config = {
      debug: false,
      batchSize: 10,
      flushInterval: 5000,
      autoPageViews: false,
      autoErrorTracking: false,
      ...config,
    };

    this.initialize();
  }

  private initialize(): void {
    if (this.config.debug) {
      console.log('[Weave BI] Initializing with config:', this.config);
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
}
