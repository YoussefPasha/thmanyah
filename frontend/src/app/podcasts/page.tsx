import { Container } from '@/components/layout/Container';
import { PodcastGrid } from '@/components/podcast/PodcastGrid';
import { PodcastFilters } from '@/components/podcast/PodcastFilters';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { podcastApi } from '@/lib/api/podcast.api';
import { Music, ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import type { Podcast } from '@/types/podcast.types';
import { PodcastsClient } from './PodcastsClient';
import { PodcastSortBy, SortOrder, type FilterParams } from '@/types/api.types';

export const revalidate = 60; // Revalidate every 60 seconds

interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
    genre?: string;
    country?: string;
    sortBy?: string;
    sortOrder?: string;
    explicitContent?: string;
  };
}

const ITEMS_PER_PAGE = 24;

export default async function PodcastsPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || '1', 10);
  const offset = (page - 1) * ITEMS_PER_PAGE;

  // Build filter params from search params
  const filterParams: FilterParams = {
    limit: ITEMS_PER_PAGE,
    offset,
    search: searchParams.search || undefined,
    genre: searchParams.genre || undefined,
    country: searchParams.country || undefined,
    sortBy: (searchParams.sortBy as PodcastSortBy) || PodcastSortBy.CREATED_AT,
    sortOrder: (searchParams.sortOrder as SortOrder) || SortOrder.DESC,
    explicitContent: searchParams.explicitContent === 'true' ? true : undefined,
  };

  let podcasts: Podcast[] = [];
  let total = 0;
  let genres: string[] = [];
  let countries: string[] = [];
  let hasError = false;

  try {
    // Fetch podcasts with filters
    const [podcastsResponse, genresResponse, countriesResponse] = await Promise.all([
      podcastApi.filter(filterParams),
      podcastApi.getGenres(),
      podcastApi.getCountries(),
    ]);

    podcasts = podcastsResponse.podcasts;
    total = podcastsResponse.total;
    genres = genresResponse;
    countries = countriesResponse;
  } catch (error) {
    console.error('Failed to fetch podcasts:', error);
    hasError = true;
  }

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header Section */}
      <section className="border-b bg-background">
        <Container className="py-8 md:py-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Music className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold md:text-4xl">جميع البودكاست</h1>
              </div>
              <p className="text-muted-foreground">
                استكشف مكتبتنا الكاملة من البودكاست مع فلاتر وخيارات ترتيب قوية
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <Container className="py-8 md:py-12">
        <div className="space-y-8">
          {/* Client-side component for filters */}
          <PodcastsClient
            initialGenres={genres}
            initialCountries={countries}
            initialFilters={{
              search: searchParams.search,
              genre: searchParams.genre,
              country: searchParams.country,
              sortBy: searchParams.sortBy as PodcastSortBy,
              sortOrder: searchParams.sortOrder as SortOrder,
              explicitContent: searchParams.explicitContent === 'true' ? true : undefined,
            }}
          />

          {/* Results Summary */}
          {!hasError && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <p>
                عرض {Math.min(offset + 1, total)} - {Math.min(offset + ITEMS_PER_PAGE, total)} من {total} بودكاست
              </p>
              {totalPages > 1 && (
                <p>
                  صفحة {page} من {totalPages}
                </p>
              )}
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <Card className="border-2 border-destructive/50">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <h3 className="mb-2 text-xl font-semibold">فشل تحميل البودكاست</h3>
                <p className="mb-6 text-muted-foreground">
                  حدث خطأ أثناء تحميل البودكاست. يرجى المحاولة مرة أخرى لاحقًا.
                </p>
                <Button asChild>
                  <Link href="/podcasts">حاول مرة أخرى</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!hasError && podcasts.length === 0 && (
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <Music className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">لم يتم العثور على بودكاست</h3>
                <p className="mb-6 text-muted-foreground">
                  جرب تغيير الفلاتر أو إعادة تعيينها للعثور على المزيد من البودكاست
                </p>
                <Button asChild variant="outline">
                  <Link href="/podcasts">إعادة تعيين الفلاتر</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Podcasts Grid */}
          {!hasError && podcasts.length > 0 && (
            <>
              <PodcastGrid podcasts={podcasts} />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  {hasPrevPage && (
                    <Button asChild variant="outline">
                      <Link
                        href={{
                          pathname: '/podcasts',
                          query: { ...searchParams, page: (page - 1).toString() },
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                        السابق
                      </Link>
                    </Button>
                  )}

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber: number;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (page <= 3) {
                        pageNumber = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = page - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNumber}
                          asChild
                          variant={page === pageNumber ? 'default' : 'outline'}
                          size="sm"
                        >
                          <Link
                            href={{
                              pathname: '/podcasts',
                              query: { ...searchParams, page: pageNumber.toString() },
                            }}
                          >
                            {pageNumber}
                          </Link>
                        </Button>
                      );
                    })}
                  </div>

                  {hasNextPage && (
                    <Button asChild variant="outline">
                      <Link
                        href={{
                          pathname: '/podcasts',
                          query: { ...searchParams, page: (page + 1).toString() },
                        }}
                      >
                        التالي
                        <ChevronLeft className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </div>
  );
}

