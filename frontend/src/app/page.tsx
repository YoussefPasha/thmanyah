import Link from 'next/link';
import { Search, Music, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/layout/Container';

export default function HomePage() {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center space-y-8 py-12 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <Music className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Discover Amazing Podcasts
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Search through thousands of podcasts from the iTunes library. Find your next favorite
            show and explore new content creators.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/search" className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Start Searching
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Powerful Search</CardTitle>
              <CardDescription>
                Search podcasts by name, artist, or topic. Get instant results from the iTunes
                database.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Music className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Extensive Library</CardTitle>
              <CardDescription>
                Access millions of podcast episodes across all genres and categories worldwide.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Discover New Content</CardTitle>
              <CardDescription>
                Find trending podcasts and discover new creators in your favorite genres.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </Container>
  );
}

