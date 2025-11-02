import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Mic } from 'lucide-react';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Podcast } from '@/types/podcast.types';
import { formatDate, truncateText } from '@/lib/utils/format';

interface PodcastCardProps {
  podcast: Podcast;
}

export function PodcastCard({ podcast }: PodcastCardProps) {
  return (
    <Link href={`/podcasts/${podcast.id}`}>
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {podcast.artworkUrl600 ? (
            <Image
              src={podcast.artworkUrl600}
              alt={podcast.trackName}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Mic className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
          {podcast.trackExplicitContent && (
            <div className="absolute left-2 top-2">
              <Badge variant="destructive">صريح</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <CardTitle className="mb-2 line-clamp-2 text-lg">
            {podcast.trackName}
          </CardTitle>
          <CardDescription className="mb-3 line-clamp-1 flex items-center gap-1 text-sm">
            <User className="h-3 w-3" />
            {podcast.artistName}
          </CardDescription>
          <div className="flex flex-wrap gap-2">
            {podcast.primaryGenreName && (
              <Badge variant="secondary">{podcast.primaryGenreName}</Badge>
            )}
            {podcast.trackCount && (
              <Badge variant="outline">{podcast.trackCount} حلقة</Badge>
            )}
          </div>
          {podcast.releaseDate && (
            <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDate(podcast.releaseDate)}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

