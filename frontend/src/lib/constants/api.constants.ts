// Server-side API URL (for SSR in Docker environment)
const SERVER_API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Client-side API URL (for browser requests)
const CLIENT_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Use server URL when running on server, client URL when running in browser
export const API_BASE_URL = typeof window === 'undefined' ? SERVER_API_URL : CLIENT_API_URL;

export const API_ENDPOINTS = {
  PODCASTS: '/podcasts',
  PODCAST_SEARCH: '/podcasts/search',
  PODCAST_FILTER: '/podcasts/filter',
  PODCAST_GENRES: '/podcasts/genres',
  PODCAST_COUNTRIES: '/podcasts/countries',
  PODCAST_BY_ID: (id: number) => `/podcasts/${id}`,
  HEALTH: '/health',
} as const;

export const DEFAULT_LIMIT = 20;
export const DEFAULT_OFFSET = 0;
export const DEFAULT_COUNTRY = 'us';
export const DEFAULT_ENTITY = 'podcast';

// Pagination limits
export const LIMIT_OPTIONS = [
  { value: '20', label: '20 نتيجة' },
  { value: '50', label: '50 نتيجة' },
  { value: '100', label: '100 نتيجة' },
  { value: '200', label: '200 نتيجة' },
] as const;

// Entity types
export const ENTITY_OPTIONS = [
  { value: 'podcast', label: 'البودكاست' },
  { value: 'podcastAuthor', label: 'منشئو البودكاست' },
] as const;

// Popular country codes
export const COUNTRY_OPTIONS = [
  { value: 'us', label: 'الولايات المتحدة' },
  { value: 'sa', label: 'السعودية' },
  { value: 'ae', label: 'الإمارات' },
  { value: 'eg', label: 'مصر' },
  { value: 'gb', label: 'المملكة المتحدة' },
  { value: 'ca', label: 'كندا' },
  { value: 'au', label: 'أستراليا' },
  { value: 'de', label: 'ألمانيا' },
  { value: 'fr', label: 'فرنسا' },
  { value: 'es', label: 'إسبانيا' },
  { value: 'it', label: 'إيطاليا' },
  { value: 'jp', label: 'اليابان' },
  { value: 'br', label: 'البرازيل' },
  { value: 'mx', label: 'المكسيك' },
  { value: 'in', label: 'الهند' },
] as const;

