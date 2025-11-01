'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { PodcastGrid } from '@/components/podcast/PodcastGrid';
import { PodcastGridSkeleton } from '@/components/podcast/PodcastSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { Container } from '@/components/layout/Container';
import { usePodcastSearch } from '@/lib/hooks/usePodcastSearch';
import type { SearchParams } from '@/types/api.types';
import { formatNumber } from '@/lib/utils/format';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const { podcasts, total, isLoading, isError, error } = usePodcastSearch(searchParams);

  const handleSearch = (term: string) => {
    setSearchParams({
      term,
      limit: 20,
      offset: 0,
    });
  };

  return (
    <Container>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Search Podcasts</h1>
          <SearchBar onSearch={handleSearch} />
        </div>

        {isLoading && <PodcastGridSkeleton />}

        {isError && (
          <ErrorMessage
            message={error?.error?.message || 'Failed to fetch podcasts'}
            retry={() => searchParams && handleSearch(searchParams.term)}
          />
        )}

        {!isLoading && !isError && searchParams && podcasts.length === 0 && (
          <EmptyState
            title="No podcasts found"
            message={`No results found for "${searchParams.term}". Try a different search term.`}
          />
        )}

        {!isLoading && !isError && podcasts.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Found {formatNumber(total)} podcast{total !== 1 ? 's' : ''}
              </p>
            </div>
            <PodcastGrid podcasts={podcasts} />
          </>
        )}

        {!searchParams && !isLoading && (
          <EmptyState
            title="Start Your Search"
            message="Enter a search term above to find podcasts from the iTunes library"
          />
        )}
      </div>
    </Container>
  );
}

