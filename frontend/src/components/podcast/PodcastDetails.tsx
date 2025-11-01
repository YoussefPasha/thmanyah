import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Globe, ExternalLink, Mic } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Podcast } from '@/types/podcast.types';
import { formatDate } from '@/lib/utils/format';

interface PodcastDetailsProps {
  podcast: Podcast;
}

export function PodcastDetails({ podcast }: PodcastDetailsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-6">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
              {podcast.artworkUrl600 ? (
                <Image
                  src={podcast.artworkUrl600}
                  alt={podcast.trackName}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Mic className="h-32 w-32 text-muted-foreground" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="mb-2 text-3xl">{podcast.trackName}</CardTitle>
                <p className="flex items-center gap-2 text-lg text-muted-foreground">
                  <User className="h-5 w-5" />
                  {podcast.artistName}
                </p>
              </div>
              {podcast.trackExplicitContent && (
                <Badge variant="destructive">صريح</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {podcast.primaryGenreName && (
                <Badge variant="secondary" className="text-sm">
                  {podcast.primaryGenreName}
                </Badge>
              )}
              {podcast.genres?.slice(1).map((genre) => (
                <Badge key={genre} variant="outline" className="text-sm">
                  {genre}
                </Badge>
              ))}
            </div>

            {podcast.description && (
              <div>
                <h3 className="mb-2 font-semibold">الوصف</h3>
                <p className="text-muted-foreground">{podcast.description}</p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {podcast.trackCount && (
                <div>
                  <p className="text-sm font-medium">الحلقات</p>
                  <p className="text-2xl font-bold">{podcast.trackCount}</p>
                </div>
              )}
              {podcast.releaseDate && (
                <div>
                  <p className="text-sm font-medium">تاريخ الإصدار</p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {formatDate(podcast.releaseDate)}
                  </p>
                </div>
              )}
              {podcast.country && (
                <div>
                  <p className="text-sm font-medium">البلد</p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    {podcast.country.toUpperCase()}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {podcast.trackViewUrl && (
                <Button asChild>
                  <a
                    href={podcast.trackViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    عرض على iTunes
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {podcast.feedUrl && (
                <Button variant="outline" asChild>
                  <a
                    href={podcast.feedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    RSS موجز
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

