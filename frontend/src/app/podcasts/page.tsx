import { Container } from '@/components/layout/Container';
import { PodcastGrid } from '@/components/podcast/PodcastGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { podcastApi } from '@/lib/api/podcast.api';
import { PodcastSortBy, SortOrder, type FilterParams } from '@/types/api.types';
import type { Podcast } from '@/types/podcast.types';
import { ChevronLeft, ChevronRight, Music } from 'lucide-react';
import Link from 'next/link';
import { PodcastsClient } from './PodcastsClient';

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
    releaseDateFrom?: string;
    releaseDateTo?: string;
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
    releaseDateFrom: searchParams.releaseDateFrom || undefined,
    releaseDateTo: searchParams.releaseDateTo || undefined,
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
        <Container className="py-4 md:py-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Music className="h-5 w-5 text-primary md:h-6 md:w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">جميع البودكاست</h1>
              <p className="text-sm text-muted-foreground">
                استكشف مكتبتنا الكاملة من البودكاست
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <Container className="py-4 md:py-6">
        <div className="space-y-4">
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
              releaseDateFrom: searchParams.releaseDateFrom,
              releaseDateTo: searchParams.releaseDateTo,
            }}
          />

          {/* Results Summary */}
          {!hasError && total > 0 && (
            <div className="flex items-center justify-between text-xs text-muted-foreground md:text-sm">
              <p>
                {Math.min(offset + 1, total)} - {Math.min(offset + ITEMS_PER_PAGE, total)} من {total}
              </p>
              {totalPages > 1 && (
                <p>
                  صفحة {page} / {totalPages}
                </p>
              )}
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <Card className="border-2 border-destructive/50">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="mb-2 text-lg font-semibold">فشل تحميل البودكاست</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  حدث خطأ أثناء تحميل البودكاست. يرجى المحاولة مرة أخرى لاحقًا.
                </p>
                <Button asChild size="sm">
                  <Link href="/podcasts">حاول مرة أخرى</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!hasError && podcasts.length === 0 && (
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Music className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">لم يتم العثور على بودكاست</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  جرب تغيير الفلاتر أو إعادة تعيينها للعثور على المزيد من البودكاست
                </p>
                <Button asChild variant="outline" size="sm">
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

