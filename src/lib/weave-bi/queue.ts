import type { WeaveEvent } from './types';

export class EventQueue {
  private queue: WeaveEvent[] = [];
  private flushTimer: any = null;

  constructor(
    private apiEndpoint: string,
    private projectId: string,
    private batchSize: number,
    private flushInterval: number,
    private debug: boolean
  ) {
    this.startFlushTimer();
  }

  enqueue(event: WeaveEvent): void {
    this.queue.push(event);

    if (this.queue.length >= this.batchSize) {
      this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: this.projectId,
          events,
        }),
        keepalive: true,
      });

      if (!response.ok) {
        console.error('[Weave BI] Failed to send events:', response.status);

        // Re-queue on failure
        this.queue.unshift(...events);
      } else if (this.debug) {
        console.log(`[Weave BI] Sent ${events.length} events`);
      }
    } catch (error) {
      console.error('[Weave BI] Network error:', error);

      // Re-queue on network error
      this.queue.unshift(...events);
    }
  }

  private startFlushTimer(): void {
    if (typeof window === 'undefined') return;

    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flush();
  }
}
