/**
 * Weave BI SDK Initialization
 *
 * Import this file in your app entry point:
 * import '@/lib/analytics';
 */

import { init } from './weave-bi';

// Initialize Weave BI
init({
  projectId: '7de4ea85-7135-4107-bc0c-6fcce214b4a5',
  apiEndpoint: 'https://dkvdjbxeacaitlbansni.supabase.co/functions/v1/ingest-events-v2',
  debug: process.env.NODE_ENV === 'development',
  autoPageViews: true,
  autoErrorTracking: true,
});

console.log('[Weave BI] Analytics initialized for project: 7de4ea85-7135-4107-bc0c-6fcce214b4a5');
