export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  path?: string;
}

export interface SearchParams {
  term: string;
  limit?: number;
  offset?: number;
  country?: string;
}

