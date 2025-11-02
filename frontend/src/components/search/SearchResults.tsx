'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PodcastGrid } from '@/components/podcast/PodcastGrid';
import { EmptyState } from '@/components/shared/EmptyState';
import { SearchFilters } from '@/components/search/SearchFilters';
import { podcastApi } from '@/lib/api/podcast.api';
import { formatNumber } from '@/lib/utils/format';
import { Skeleton } from '@/components/ui/skeleton';
import type { Podcast } from '@/types/podcast.types';
import { DEFAULT_COUNTRY, DEFAULT_ENTITY } from '@/lib/constants/api.constants';

interface SearchResultsProps {
  initialSearchTerm: string;
}

export function SearchResults({ initialSearchTerm }: SearchResultsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get filter values from URL or use defaults
  const [limit, setLimit] = useState(searchParams.get('limit') || '20');
  const [country, setCountry] = useState(searchParams.get('country') || DEFAULT_COUNTRY);
  const [entity, setEntity] = useState(searchParams.get('entity') || DEFAULT_ENTITY);
  
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    const urlLimit = searchParams.get('limit') || '20';
    const urlCountry = searchParams.get('country') || DEFAULT_COUNTRY;
    const urlEntity = searchParams.get('entity') || DEFAULT_ENTITY;
    
    setLimit(urlLimit);
    setCountry(urlCountry);
    setEntity(urlEntity);
  }, [searchParams]);

  // Update URL when filters change
  const updateURL = (newLimit?: string, newCountry?: string, newEntity?: string) => {
    const params = new URLSearchParams();
    params.set('q', initialSearchTerm);
    params.set('limit', newLimit || limit);
    params.set('country', newCountry || country);
    params.set('entity', newEntity || entity);
    
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  // Fetch podcasts when search term or filters change
  useEffect(() => {
    const fetchPodcasts = async () => {
      if (!initialSearchTerm || initialSearchTerm.length < 2) {
        setPodcasts([]);
        setTotal(0);
        return;
      }

      setIsLoading(true);
      setHasError(false);

      try {
        const response = await podcastApi.search({
          term: initialSearchTerm,
          limit: parseInt(limit, 10),
          offset: 0,
          country,
          entity: entity as 'podcast' | 'podcastAuthor',
        });
        
        setPodcasts(response.podcasts);
        setTotal(response.total);
      } catch (error) {
        console.error('Failed to search podcasts:', error);
        setHasError(true);
        setPodcasts([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPodcasts();
  }, [initialSearchTerm, limit, country, entity]);

  const handleLimitChange = (newLimit: string) => {
    setLimit(newLimit);
    updateURL(newLimit, country, entity);
  };

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    updateURL(limit, newCountry, entity);
  };

  const handleEntityChange = (newEntity: string) => {
    setEntity(newEntity);
    updateURL(limit, country, newEntity);
  };

  // Show error state
  if (hasError && initialSearchTerm) {
    return (
      <EmptyState
        title="حدث خطأ"
        message="فشل في جلب البودكاست. يرجى المحاولة مرة أخرى لاحقًا."
      />
    );
  }

  // Show empty state for no search term
  if (!initialSearchTerm) {
    return (
      <EmptyState
        title="ابدأ البحث"
        message="أدخل مصطلح بحث أعلاه للعثور على البودكاست من مكتبة iTunes"
      />
    );
  }

  // Show empty state for short search term
  if (initialSearchTerm.length < 2) {
    return (
      <EmptyState
        title="ابدأ البحث"
        message="الرجاء إدخال حرفين على الأقل للبحث"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <SearchFilters
        country={country}
        entity={entity}
        limit={limit}
        onCountryChange={handleCountryChange}
        onEntityChange={handleEntityChange}
        onLimitChange={handleLimitChange}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: parseInt(limit, 10) }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!isLoading && podcasts.length === 0 && (
        <EmptyState
          title="لم يتم العثور على بودكاست"
          message={`لم يتم العثور على نتائج لـ "${initialSearchTerm}". جرب مصطلح بحث مختلف أو غير الفلاتر.`}
        />
      )}

      {/* Results */}
      {!isLoading && podcasts.length > 0 && (
        <>
          {/* Results Summary */}
          <div className="border-b pb-4">
            <p className="text-lg font-semibold">
              تم العثور على {formatNumber(total)} {entity === 'podcast' ? 'بودكاست' : 'منشئ بودكاست'}
            </p>
            <p className="text-sm text-muted-foreground">
              عرض {formatNumber(podcasts.length)} نتيجة لـ "{initialSearchTerm}"
            </p>
          </div>

          {/* Podcasts Grid */}
          <PodcastGrid podcasts={podcasts} />

          {/* iTunes API Limitation Notice */}
          {total > parseInt(limit, 10) && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center dark:border-amber-900 dark:bg-amber-950">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                ℹ️ تم العثور على {formatNumber(total)} نتيجة إجمالية. لعرض المزيد، قم بزيادة عدد النتائج من الفلاتر أعلاه (حتى 200).
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

