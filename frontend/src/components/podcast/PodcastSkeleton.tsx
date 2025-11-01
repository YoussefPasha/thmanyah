import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function PodcastSkeleton() {
  return (
    <Card>
      <Skeleton className="aspect-square w-full" />
      <CardContent className="p-4">
        <Skeleton className="mb-2 h-6 w-full" />
        <Skeleton className="mb-3 h-4 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="mt-3 h-3 w-24" />
      </CardContent>
    </Card>
  );
}

export function PodcastGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <PodcastSkeleton key={i} />
      ))}
    </div>
  );
}

