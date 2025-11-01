export interface WeaveConfig {
  projectId: string;
  apiEndpoint: string;
  debug?: boolean;
  batchSize?: number;
  flushInterval?: number;
  autoPageViews?: boolean;
  autoErrorTracking?: boolean;
}

export interface WeaveEvent {
  event_name: string;
  properties?: Record<string, any>;
  timestamp: string;
  user_id?: string;
  session_id: string;
  page_url?: string;
  referrer?: string;
  user_agent?: string;
  sdk_version: string;
}

export interface WeaveContext {
  [key: string]: any;
}
