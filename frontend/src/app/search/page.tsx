import { SearchBar } from '@/components/search/SearchBar';
import { PodcastGrid } from '@/components/podcast/PodcastGrid';
import { EmptyState } from '@/components/shared/EmptyState';
import { Container } from '@/components/layout/Container';
import { podcastApi } from '@/lib/api/podcast.api';
import { formatNumber } from '@/lib/utils/format';
import type { Podcast } from '@/types/podcast.types';

export const revalidate = 60; // Revalidate every 60 seconds

interface SearchPageProps {
  searchParams: { q?: string | string[] };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Handle both string and string[] cases for query parameters
  const rawSearchTerm = searchParams.q;
  const searchTerm = (Array.isArray(rawSearchTerm) ? rawSearchTerm[0] : rawSearchTerm)?.trim();
  
  let podcasts: Podcast[] = [];
  let total = 0;
  let hasError = false;

  // Only fetch if there's a search term with at least 2 characters
  if (searchTerm && searchTerm.length >= 2) {
    try {
      const response = await podcastApi.search({
        term: searchTerm,
        limit: 20,
        offset: 0,
      });
      podcasts = response.podcasts;
      total = response.total;
    } catch (error) {
      console.error('Failed to search podcasts:', error);
      hasError = true;
    }
  }

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
          <SearchBar defaultValue={searchTerm || ''} />
        </div>

        {hasError && searchTerm && (
          <EmptyState
            title="حدث خطأ"
            message="فشل في جلب البودكاست. يرجى المحاولة مرة أخرى لاحقًا."
          />
        )}

        {!hasError && searchTerm && searchTerm.length >= 2 && podcasts.length === 0 && (
          <EmptyState
            title="لم يتم العثور على بودكاست"
            message={`لم يتم العثور على نتائج لـ "${searchTerm}". جرب مصطلح بحث مختلف.`}
          />
        )}

        {!hasError && podcasts.length > 0 && (
          <>
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="text-lg font-semibold">
                  تم العثور على {formatNumber(total)} بودكاست
                </p>
                <p className="text-sm text-muted-foreground">
                  عرض النتائج لـ "{searchTerm}"
                </p>
              </div>
            </div>
            <PodcastGrid podcasts={podcasts} />
          </>
        )}

        {!searchTerm && (
          <EmptyState
            title="ابدأ البحث"
            message="أدخل مصطلح بحث أعلاه للعثور على البودكاست من مكتبة iTunes"
          />
        )}
      </div>
    </Container>
  );
}

