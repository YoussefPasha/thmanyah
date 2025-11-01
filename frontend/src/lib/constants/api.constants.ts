export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const API_ENDPOINTS = {
  PODCASTS: '/podcasts',
  PODCAST_SEARCH: '/podcasts/search',
  PODCAST_BY_ID: (id: number) => `/podcasts/${id}`,
  HEALTH: '/health',
} as const;

export const DEFAULT_LIMIT = 20;
export const DEFAULT_OFFSET = 0;
export const DEFAULT_COUNTRY = 'us';

