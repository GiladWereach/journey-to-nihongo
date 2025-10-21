import type { Integration } from '../integrations/base';

interface QueuedEvent {
  event: string;
  properties: Record<string, any>;
  userId?: string;
  timestamp: string;
}

export class EventQueue {
  private queue: QueuedEvent[] = [];
  private flushTimer: number | null = null;
  private isFlushing = false;

  constructor(
    private projectId: string,
    private integrations: Integration[],
    private onResult: (integration: string, success: boolean, latency: number) => void,
    private batchSize: number,
    private flushInterval: number,
    private debug: boolean
  ) {
    this.startFlushTimer();
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.flush());
    }
  }

  add(event: QueuedEvent): void {
    this.queue.push(event);
    this.log(`Event queued. Queue size: ${this.queue.length}`);
    if (this.queue.length >= this.batchSize) {
      this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.isFlushing || this.queue.length === 0 || this.integrations.length === 0) {
      return;
    }

    this.isFlushing = true;
    const eventsToSend = [...this.queue];
    this.queue = [];

    try {
      for (const event of eventsToSend) {
        const promises = this.integrations.map(async (integration) => {
          const startTime = Date.now();
          try {
            await integration.track(event.event, event.properties, event.userId);
            this.onResult(integration.name, true, Date.now() - startTime);
          } catch (error) {
            this.onResult(integration.name, false, Date.now() - startTime);
            this.log('Failed to send:', error);
          }
        });
        await Promise.all(promises);
      }
    } finally {
      this.isFlushing = false;
    }
  }

  private startFlushTimer(): void {
    if (this.flushTimer) clearInterval(this.flushTimer);
    if (typeof window !== 'undefined') {
      this.flushTimer = window.setInterval(() => this.flush(), this.flushInterval);
    }
  }

  private log(...args: any[]): void {
    if (this.debug) {
      console.log('[CodeTrack Queue]', ...args);
    }
  }
}