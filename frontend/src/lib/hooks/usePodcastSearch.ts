import useSWR from 'swr';
import { podcastApi } from '../api/podcast.api';
import type { SearchParams } from '@/types/api.types';
import type { PodcastListResponse } from '@/types/podcast.types';
import { STALE_TIME } from '../constants/app.constants';

export function usePodcastSearch(params: SearchParams | null) {
  const { data, error, isLoading, mutate } = useSWR(
    params && params.term ? ['podcast-search', params] : null,
    () => podcastApi.search(params!),
    {
      revalidateOnFocus: false,
      dedupingInterval: STALE_TIME,
    },
  );

  return {
    podcasts: data?.podcasts || [],
    total: data?.total || 0,
    limit: data?.limit || 20,
    offset: data?.offset || 0,
    isLoading,
    isError: error,
    error,
    mutate,
  };
}

export function usePodcast(id: number | null) {
  const { data, error, isLoading } = useSWR(
    id ? ['podcast', id] : null,
    () => podcastApi.getById(id!),
    {
      revalidateOnFocus: false,
    },
  );

  return {
    podcast: data,
    isLoading,
    isError: error,
    error,
  };
}

export function usePodcasts(limit: number = 20, offset: number = 0) {
  const { data, error, isLoading, mutate } = useSWR(
    ['podcasts', limit, offset],
    () => podcastApi.getAll(limit, offset),
    {
      revalidateOnFocus: false,
      dedupingInterval: STALE_TIME,
    },
  );

  return {
    podcasts: data?.podcasts || [],
    total: data?.total || 0,
    limit: data?.limit || 20,
    offset: data?.offset || 0,
    isLoading,
    isError: error,
    error,
    mutate,
  };
}

