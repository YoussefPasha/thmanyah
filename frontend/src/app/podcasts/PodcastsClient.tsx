'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PodcastFilters } from '@/components/podcast/PodcastFilters';
import { PodcastSortBy, SortOrder } from '@/types/api.types';

interface PodcastsClientProps {
  initialGenres: string[];
  initialCountries: string[];
  initialFilters: {
    search?: string;
    genre?: string;
    country?: string;
    sortBy?: PodcastSortBy;
    sortOrder?: SortOrder;
    explicitContent?: boolean;
    releaseDateFrom?: string;
    releaseDateTo?: string;
  };
}

export function PodcastsClient({
  initialGenres,
  initialCountries,
  initialFilters,
}: PodcastsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = React.useState(initialFilters);

  // Debounce filter changes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();

      if (filters.search) params.set('search', filters.search);
      if (filters.genre) params.set('genre', filters.genre);
      if (filters.country) params.set('country', filters.country);
      if (filters.sortBy) params.set('sortBy', filters.sortBy);
      if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
      if (filters.explicitContent) params.set('explicitContent', 'true');
      if (filters.releaseDateFrom) params.set('releaseDateFrom', filters.releaseDateFrom);
      if (filters.releaseDateTo) params.set('releaseDateTo', filters.releaseDateTo);

      // Reset to page 1 when filters change
      params.set('page', '1');

      router.push(`/podcasts?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters, router]);

  const handleReset = () => {
    setFilters({});
    router.push('/podcasts');
  };

  return (
    <PodcastFilters
      genres={initialGenres}
      countries={initialCountries}
      filters={filters}
      onFilterChange={setFilters}
      onReset={handleReset}
    />
  );
}

