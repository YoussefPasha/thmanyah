// Server-side API URL (for SSR in Docker environment)
const SERVER_API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Client-side API URL (for browser requests)
const CLIENT_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Use server URL when running on server, client URL when running in browser
export const API_BASE_URL = typeof window === 'undefined' ? SERVER_API_URL : CLIENT_API_URL;

export const API_ENDPOINTS = {
  PODCASTS: '/podcasts',
  PODCAST_SEARCH: '/podcasts/search',
  PODCAST_BY_ID: (id: number) => `/podcasts/${id}`,
  HEALTH: '/health',
} as const;

export const DEFAULT_LIMIT = 20;
export const DEFAULT_OFFSET = 0;
export const DEFAULT_COUNTRY = 'us';

