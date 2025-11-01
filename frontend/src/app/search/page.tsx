'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const queryParam = urlSearchParams.get('q');
  
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const { podcasts, total, isLoading, isError, error } = usePodcastSearch(searchParams);

  // Initialize search from URL query parameter
  useEffect(() => {
    if (queryParam && queryParam.trim().length >= 2) {
      setSearchParams({
        term: queryParam.trim(),
        limit: 20,
        offset: 0,
      });
    }
  }, [queryParam]);

  const handleSearch = (term: string) => {
    // Update URL with search query
    router.push(`/search?q=${encodeURIComponent(term)}`);
    
    setSearchParams({
      term,
      limit: 20,
      offset: 0,
    });
  };

  return (
    <Container>
      <div className="space-y-8 py-8">
        <div className="space-y-4">
          <div>
            <h1 className="mb-2 text-4xl font-bold">Search Podcasts</h1>
            <p className="text-muted-foreground">
              Search through thousands of podcasts from the iTunes library
            </p>
          </div>
          <SearchBar 
            onSearch={handleSearch} 
            defaultValue={queryParam || ''}
          />
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
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="text-lg font-semibold">
                  Found {formatNumber(total)} podcast{total !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-muted-foreground">
                  Showing results for "{searchParams?.term}"
                </p>
              </div>
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

