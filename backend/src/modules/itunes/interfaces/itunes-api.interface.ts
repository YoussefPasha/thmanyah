export interface ITunesSearchParams {
  term: string;
  country?: string;
  media?: string;
  entity?: string;
  limit?: number;
  offset?: number;
}

export interface ITunesApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

