'use client';

import { useState, useEffect, useCallback } from 'react';
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
    } else if (!queryParam) {
      // Clear search params when query param is removed
      setSearchParams(null);
    }
  }, [queryParam]);

  const handleSearch = useCallback((term: string) => {
    // Update URL with search query
    router.push(`/search?q=${encodeURIComponent(term)}`);
    
    setSearchParams({
      term,
      limit: 20,
      offset: 0,
    });
  }, [router]);

  return (
    <Container>
      <div className="space-y-8 py-8">
        <div className="space-y-4">
          <div>
            <h1 className="mb-2 text-4xl font-bold">البحث عن البودكاست</h1>
            <p className="text-muted-foreground">
              ابحث بين الآلاف من البودكاست من مكتبة iTunes
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
            message={error?.error?.message || 'فشل في جلب البودكاست'}
            retry={() => searchParams && handleSearch(searchParams.term)}
          />
        )}

        {!isLoading && !isError && searchParams && podcasts.length === 0 && (
          <EmptyState
            title="لم يتم العثور على بودكاست"
            message={`لم يتم العثور على نتائج لـ "${searchParams.term}". جرب مصطلح بحث مختلف.`}
          />
        )}

        {!isLoading && !isError && podcasts.length > 0 && (
          <>
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="text-lg font-semibold">
                  تم العثور على {formatNumber(total)} بودكاست
                </p>
                <p className="text-sm text-muted-foreground">
                  عرض النتائج لـ "{searchParams?.term}"
                </p>
              </div>
            </div>
            <PodcastGrid podcasts={podcasts} />
          </>
        )}

        {!searchParams && !isLoading && (
          <EmptyState
            title="ابدأ البحث"
            message="أدخل مصطلح بحث أعلاه للعثور على البودكاست من مكتبة iTunes"
          />
        )}
      </div>
    </Container>
  );
}

