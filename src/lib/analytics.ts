/**
 * Weave BI SDK Initialization
 *
 * Import this file in your app entry point:
 * import '@/lib/analytics';
 *
 * This SDK automatically tracks:
 * - Page views (via autoPageViews)
 * - Errors (via autoErrorTracking)
 * - Clicks on specified elements (via autoClickTracking)
 * - Form submissions (via autoFormTracking)
 */

import { init } from './weave-bi';

// Initialize Weave BI with auto-tracking
init({
  projectId: '7de4ea85-7135-4107-bc0c-6fcce214b4a5',
  apiEndpoint: 'https://dkvdjbxeacaitlbansni.supabase.co/functions/v1/ingest-events-v2',
  debug: process.env.NODE_ENV === 'development',
  autoPageViews: true,
  autoErrorTracking: true,
  autoClickTracking: true,
  autoFormTracking: true,
  events: []
});

console.log('[Weave BI] Analytics initialized for project: 7de4ea85-7135-4107-bc0c-6fcce214b4a5');
console.log('[Weave BI] Auto-tracking 0 events via event delegation');
