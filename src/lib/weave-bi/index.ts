/**
 * Weave BI SDK
 * Complete analytics SDK for event tracking
 */

export { WeaveClient } from './client';
export type { WeaveConfig, WeaveEvent } from './types';

import { WeaveClient } from './client';

let globalInstance: WeaveClient | null = null;

/**
 * Initialize Weave BI
 */
export function init(config: any): WeaveClient {
  globalInstance = new WeaveClient(config);

  if (typeof window !== 'undefined') {
    (window as any).__weave = globalInstance;
  }

  return globalInstance;
}

/**
 * Track an event
 */
export function track(eventName: string, properties?: Record<string, any>): void {
  if (!globalInstance) {
    console.warn('[Weave BI] SDK not initialized. Call init() first.');
    return;
  }

  globalInstance.track(eventName, properties);
}

export default { init, track };
