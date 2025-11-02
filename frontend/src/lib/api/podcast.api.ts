import { apiClient } from './client';
import { API_ENDPOINTS, DEFAULT_LIMIT, DEFAULT_OFFSET } from '../constants/api.constants';
import type { Podcast, PodcastListResponse } from '@/types/podcast.types';
import type { SearchParams, FilterParams } from '@/types/api.types';

export const podcastApi = {
  search: async (params: SearchParams): Promise<PodcastListResponse> => {
    const response = await apiClient.get<PodcastListResponse>(API_ENDPOINTS.PODCAST_SEARCH, {
      term: params.term,
      limit: params.limit || DEFAULT_LIMIT,
      offset: params.offset || DEFAULT_OFFSET,
      country: params.country,
      entity: params.entity,
    });
    return response.data;
  },

  getAll: async (limit: number = DEFAULT_LIMIT, offset: number = DEFAULT_OFFSET): Promise<PodcastListResponse> => {
    const response = await apiClient.get<PodcastListResponse>(API_ENDPOINTS.PODCASTS, {
      limit,
      offset,
    });
    return response.data;
  },

  filter: async (params: FilterParams): Promise<PodcastListResponse> => {
    const response = await apiClient.get<PodcastListResponse>(API_ENDPOINTS.PODCAST_FILTER, params);
    return response.data;
  },

  getGenres: async (): Promise<string[]> => {
    const response = await apiClient.get<{ genres: string[] }>(API_ENDPOINTS.PODCAST_GENRES);
    return response.data.genres;
  },

  getCountries: async (): Promise<string[]> => {
    const response = await apiClient.get<{ countries: string[] }>(API_ENDPOINTS.PODCAST_COUNTRIES);
    return response.data.countries;
  },

  getById: async (id: number): Promise<Podcast> => {
    const response = await apiClient.get<Podcast>(API_ENDPOINTS.PODCAST_BY_ID(id));
    return response.data;
  },
};

