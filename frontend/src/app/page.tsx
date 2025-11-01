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
                  اكتشف بودكاست
                  <br />
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text">
                    مذهلة
                  </span>
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                  استكشف الآلاف من البودكاست من مكتبة iTunes. اعثر على برنامجك المفضل التالي واكتشف منشئي محتوى جدد.
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
                <div className="text-sm text-muted-foreground">بودكاست</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">1M+</div>
                <div className="text-sm text-muted-foreground">حلقة</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">تصنيف</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <Container>
        <div className="py-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">لماذا تختارنا؟</h2>
            <p className="text-muted-foreground">كل ما تحتاجه لاكتشاف والاستمتاع بالبودكاست</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="group border-2 transition-all hover:border-primary hover:shadow-lg">
              <CardHeader>
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-110">
                  <Search className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">بحث قوي</CardTitle>
                <CardDescription className="text-base">
                  ابحث عن البودكاست بالاسم أو الفنان أو الموضوع. احصل على نتائج فورية من قاعدة بيانات iTunes مع تصفية متقدمة.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-2 transition-all hover:border-primary hover:shadow-lg">
              <CardHeader>
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-110">
                  <Library className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">مكتبة واسعة</CardTitle>
                <CardDescription className="text-base">
                  الوصول إلى ملايين حلقات البودكاست عبر جميع الأنواع والفئات من جميع أنحاء العالم.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-2 transition-all hover:border-primary hover:shadow-lg">
              <CardHeader>
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-110">
                  <TrendingUp className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">محتوى جديد</CardTitle>
                <CardDescription className="text-base">
                  اكتشف البودكاست الشائع واستكشف منشئين جدد في أنواعك المفضلة يوميًا.
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
                <h2 className="mb-2 text-3xl font-bold">البودكاست الأخيرة</h2>
                <p className="text-muted-foreground">
                  تصفح أحدث مجموعة من البودكاست من قاعدة البيانات
                </p>
              </div>
              {podcasts.length > 0 && (
                <Button asChild variant="outline" className="gap-2">
                  <Link href="/search">
                    عرض الكل
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>

            {isLoading && <PodcastGridSkeleton />}

            {isError && (
              <ErrorMessage
                message={error?.message || 'فشل تحميل البودكاست'}
                retry={() => mutate()}
              />
            )}

            {!isLoading && !isError && podcasts.length === 0 && (
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
                <h2 className="text-3xl font-bold">هل أنت مستعد لبدء الاستماع؟</h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                  انضم إلى الآلاف من عشاق البودكاست الذين يكتشفون محتوى رائع كل يوم
                </p>
              </div>
              <Button asChild size="lg" className="gap-2 text-base">
                <Link href="/search">
                  <Search className="h-5 w-5" />
                  استكشف البودكاست الآن
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}

