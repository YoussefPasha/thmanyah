import { Container } from '@/components/layout/Container';
import { PodcastGrid } from '@/components/podcast/PodcastGrid';
import { HeroSearchBox } from '@/components/search/HeroSearchBox';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { podcastApi } from '@/lib/api/podcast.api';
import { formatNumber } from '@/lib/utils/format';
import { ChevronLeft, Music, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { Podcast } from '@/types/podcast.types';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  let podcasts: Podcast[] = [];
  let total = 0;
  let hasError = false;

  try {
    const response = await podcastApi.getAll(12, 0);
    podcasts = response.podcasts;
    total = response.total;
  } catch (error) {
    console.error('Failed to fetch podcasts:', error);
    hasError = true;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <Container className="py-16 md:py-24 lg:py-32">
          <div className="relative flex flex-col items-center justify-center space-y-10 text-center">
            <div className="space-y-8">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-2xl" />
                  <div className="relative rounded-full bg-gradient-to-br from-primary to-primary/60 p-6 shadow-xl">
                    <Music className="h-16 w-16 text-white md:h-20 md:w-20" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
                  اكتشف بودكاست
                  <br />
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text">
                    مذهلة
                  </span>
                </h1>
                <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
                  استكشف الآلاف من البودكاست من مكتبة iTunes. اعثر على برنامجك المفضل التالي واكتشف منشئي محتوى جدد.
                </p>
              </div>
            </div>

            {/* Hero Search Box */}
            <div className="w-full max-w-3xl">
              <HeroSearchBox />
            </div>

            {/* Stats */}
            <div className="grid w-full max-w-4xl grid-cols-3 gap-4 pt-4 sm:gap-8 sm:pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary sm:text-3xl md:text-4xl">{formatNumber(total)}</div>
                <div className="text-xs text-muted-foreground sm:text-sm">بودكاست</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary sm:text-3xl md:text-4xl">1M+</div>
                <div className="text-xs text-muted-foreground sm:text-sm">حلقة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary sm:text-3xl md:text-4xl">50+</div>
                <div className="text-xs text-muted-foreground sm:text-sm">تصنيف</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Recent Podcasts Section */}
      <section className="bg-muted/30 py-16 md:py-20 lg:py-24">
        <Container>
          <div className="space-y-8 md:space-y-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="mb-2 text-3xl font-bold md:text-4xl">البودكاست الأخيرة</h2>
                <p className="text-base text-muted-foreground md:text-lg">
                  تصفح أحدث مجموعة من البودكاست من قاعدة البيانات
                </p>
              </div>
              {podcasts.length > 0 && (
                <Button asChild variant="outline" className="w-fit gap-2">
                  <Link href="/search">
                    عرض الكل
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>

            {hasError && (
              <Card className="border-2 border-destructive/50">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <h3 className="mb-2 text-xl font-semibold">فشل تحميل البودكاست</h3>
                  <p className="mb-6 text-muted-foreground">
                    حدث خطأ أثناء تحميل البودكاست. يرجى المحاولة مرة أخرى لاحقًا.
                  </p>
                </CardContent>
              </Card>
            )}

            {!hasError && podcasts.length === 0 && (
              <Card className="border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Sparkles className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">لا توجد بودكاست بعد</h3>
                  <p className="mb-6 text-muted-foreground">
                    ابدأ البحث لاكتشاف وحفظ البودكاست في مجموعتك
                  </p>
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/search">
                      <Search className="h-5 w-5" />
                      ابدأ البحث
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {!hasError && podcasts.length > 0 && (
              <PodcastGrid podcasts={podcasts} />
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}

