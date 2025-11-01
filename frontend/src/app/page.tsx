'use client';

import { Search, Music, TrendingUp, Library, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/layout/Container';
import { HeroSearchBox } from '@/components/search/HeroSearchBox';
import { PodcastGrid } from '@/components/podcast/PodcastGrid';
import { PodcastGridSkeleton } from '@/components/podcast/PodcastSkeleton';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { usePodcasts } from '@/lib/hooks/usePodcastSearch';
import { formatNumber } from '@/lib/utils/format';

export default function HomePage() {
  const { podcasts, total, isLoading, isError, error, mutate } = usePodcasts(12, 0);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <Container>
          <div className="relative flex flex-col items-center justify-center space-y-8 py-16 text-center md:py-24">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-2xl" />
                  <div className="relative rounded-full bg-gradient-to-br from-primary to-primary/60 p-6 shadow-xl">
                    <Music className="h-16 w-16 text-white" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl">
                  Discover Amazing
                  <br />
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text">
                    Podcasts
                  </span>
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                  Explore thousands of podcasts from the iTunes library. Find your next favorite
                  show and discover new content creators.
                </p>
              </div>
            </div>

            {/* Hero Search Box */}
            <div className="w-full px-4">
              <HeroSearchBox />
            </div>

            {/* Stats */}
            <div className="grid w-full max-w-3xl grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{formatNumber(total)}</div>
                <div className="text-sm text-muted-foreground">Podcasts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">1M+</div>
                <div className="text-sm text-muted-foreground">Episodes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <Container>
        <div className="py-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Why Choose Us?</h2>
            <p className="text-muted-foreground">Everything you need to discover and enjoy podcasts</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="group border-2 transition-all hover:border-primary hover:shadow-lg">
              <CardHeader>
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-110">
                  <Search className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">Powerful Search</CardTitle>
                <CardDescription className="text-base">
                  Search podcasts by name, artist, or topic. Get instant results from the iTunes
                  database with advanced filtering.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-2 transition-all hover:border-primary hover:shadow-lg">
              <CardHeader>
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-110">
                  <Library className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">Extensive Library</CardTitle>
                <CardDescription className="text-base">
                  Access millions of podcast episodes across all genres and categories from around the world.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-2 transition-all hover:border-primary hover:shadow-lg">
              <CardHeader>
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-110">
                  <TrendingUp className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">Fresh Content</CardTitle>
                <CardDescription className="text-base">
                  Discover trending podcasts and explore new creators in your favorite genres daily.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </Container>

      {/* Recent Podcasts Section */}
      <section className="bg-muted/30 py-16">
        <Container>
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="mb-2 text-3xl font-bold">Recent Podcasts</h2>
                <p className="text-muted-foreground">
                  Browse our latest collection of podcasts from the database
                </p>
              </div>
              {podcasts.length > 0 && (
                <Button asChild variant="outline" className="gap-2">
                  <Link href="/search">
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>

            {isLoading && <PodcastGridSkeleton />}

            {isError && (
              <ErrorMessage
                message={error?.message || 'Failed to load podcasts'}
                retry={() => mutate()}
              />
            )}

            {!isLoading && !isError && podcasts.length === 0 && (
              <Card className="border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Sparkles className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">No Podcasts Yet</h3>
                  <p className="mb-6 text-muted-foreground">
                    Start searching to discover and save podcasts to your collection
                  </p>
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/search">
                      <Search className="h-5 w-5" />
                      Start Searching
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {!isLoading && !isError && podcasts.length > 0 && (
              <PodcastGrid podcasts={podcasts} />
            )}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <Container>
        <div className="py-16">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="flex flex-col items-center justify-center space-y-6 py-16 text-center">
              <Sparkles className="h-16 w-16 text-primary" />
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Ready to Start Listening?</h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                  Join thousands of podcast enthusiasts discovering amazing content every day
                </p>
              </div>
              <Button asChild size="lg" className="gap-2 text-base">
                <Link href="/search">
                  <Search className="h-5 w-5" />
                  Explore Podcasts Now
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}

