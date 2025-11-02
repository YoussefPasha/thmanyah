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
    statusCode?: number;
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

export enum PodcastSortBy {
  CREATED_AT = 'createdAt',
  RELEASE_DATE = 'releaseDate',
  TRACK_NAME = 'trackName',
  ARTIST_NAME = 'artistName',
  TRACK_COUNT = 'trackCount',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface FilterParams {
  limit?: number;
  offset?: number;
  sortBy?: PodcastSortBy;
  sortOrder?: SortOrder;
  genre?: string;
  country?: string;
  explicitContent?: boolean;
  search?: string;
  minTrackCount?: number;
  maxTrackCount?: number;
  releaseDateFrom?: string;
  releaseDateTo?: string;
}

