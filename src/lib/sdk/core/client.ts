import { EventQueue } from './queue';
import { Storage } from './storage';
import { validateEvent, validateProperties } from '../utils/validators';
import { AmplitudeIntegration } from '../integrations/amplitude';
import { MixpanelIntegration } from '../integrations/mixpanel';
import { PostHogIntegration } from '../integrations/posthog';
import { GA4Integration } from '../integrations/ga4';
import { SegmentIntegration } from '../integrations/segment';
import { WebhookIntegration } from '../integrations/webhook';
import type { Integration } from '../integrations/base';

export interface IntegrationConfig {
  amplitude?: { apiKey: string };
  mixpanel?: { token: string };
  posthog?: { apiKey: string; host?: string };
  ga4?: { measurementId: string; apiSecret: string };
  segment?: { writeKey: string };
  webhook?: { url: string; headers?: Record<string, string> };
}

export interface CodeTrackConfig {
  projectId: string;
  integrations?: IntegrationConfig;
  supabaseUrl?: string;
  autoTrack?: {
    pageViews?: boolean;
    clicks?: boolean;
    errors?: boolean;
    performance?: boolean;
  };
  debug?: boolean;
  batchSize?: number;
  flushInterval?: number;
  reportHealth?: boolean;
  healthReportInterval?: number;
}

export interface TrackEventOptions {
  userId?: string;
  timestamp?: Date;
  [key: string]: any;
}

export interface IdentifyOptions {
  [key: string]: any;
}

class CodeTrackClient {
  private config: CodeTrackConfig | null = null;
  private queue: EventQueue | null = null;
  private storage: Storage | null = null;
  private integrations: Integration[] = [];
  private currentUserId: string | null = null;
  private initialized = false;

  init(config: CodeTrackConfig): void {
    if (this.initialized) {
      this.log('CodeTrack already initialized');
      return;
    }

    if (!config.projectId) {
      throw new Error('projectId is required');
    }

    this.config = {
      debug: false,
      batchSize: 1,
      flushInterval: 1000,
      ...config,
    };

    this.storage = new Storage(config.projectId);
    this.setupIntegrations(config.integrations || {});
    
    this.queue = new EventQueue(
      this.config.projectId,
      this.integrations,
      () => {},
      this.config.batchSize!,
      this.config.flushInterval!,
      this.config.debug!
    );

    this.currentUserId = this.storage.getUserId();
    this.initialized = true;
    this.log('CodeTrack initialized');
  }

  private setupIntegrations(integrations: IntegrationConfig): void {
    if (integrations.amplitude) {
      this.integrations.push(new AmplitudeIntegration(integrations.amplitude.apiKey, this.config!.debug!));
    }
    if (integrations.mixpanel) {
      this.integrations.push(new MixpanelIntegration(integrations.mixpanel.token, this.config!.debug!));
    }
    if (integrations.posthog) {
      this.integrations.push(new PostHogIntegration(integrations.posthog.apiKey, integrations.posthog.host, this.config!.debug!));
    }
    if (integrations.ga4) {
      this.integrations.push(new GA4Integration(integrations.ga4.measurementId, integrations.ga4.apiSecret, this.config!.debug!));
    }
    if (integrations.segment) {
      this.integrations.push(new SegmentIntegration(integrations.segment, this.config!.debug!));
    }
    if (integrations.webhook) {
      this.integrations.push(new WebhookIntegration(integrations.webhook.url, integrations.webhook.headers, this.config!.debug!));
    }
  }

  track(eventName: string, properties?: Record<string, any>): void {
    if (!this.initialized || !this.queue) {
      console.error('CodeTrack not initialized. Call CodeTrack.init() first.');
      return;
    }

    const eventValidation = validateEvent(eventName);
    if (!eventValidation.valid) {
      console.error('Invalid event name:', eventValidation.error);
      return;
    }

    if (properties) {
      const propsValidation = validateProperties(properties);
      if (!propsValidation.valid) {
        console.error('Invalid properties:', propsValidation.error);
        return;
      }
    }

    const event = {
      event: eventName,
      properties: properties || {},
      userId: this.currentUserId || undefined,
      timestamp: new Date().toISOString(),
    };

    this.log('Tracking event:', event);
    this.queue.add(event);
  }

  identify(userId: string, traits?: IdentifyOptions): void {
    if (!this.initialized || !this.storage) {
      console.error('CodeTrack not initialized');
      return;
    }

    this.currentUserId = userId;
    this.storage.setUserId(userId);

    if (traits) {
      this.storage.setUserTraits(traits);
    }

    this.track('user_identified', { user_id: userId, ...traits });
  }

  reset(): void {
    if (!this.storage) return;
    this.currentUserId = null;
    this.storage.clearUser();
  }

  flush(): Promise<void> {
    return this.queue ? this.queue.flush() : Promise.resolve();
  }

  private log(...args: any[]): void {
    if (this.config?.debug) {
      console.log('[CodeTrack]', ...args);
    }
  }
}

export const CodeTrack = new CodeTrackClient();