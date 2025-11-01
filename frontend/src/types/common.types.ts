export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface PaginationState {
  limit: number;
  offset: number;
  total: number;
}

