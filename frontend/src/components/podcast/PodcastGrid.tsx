import React from 'react';
import { PodcastCard } from './PodcastCard';
import type { Podcast } from '@/types/podcast.types';

interface PodcastGridProps {
  podcasts: Podcast[];
}

export function PodcastGrid({ podcasts }: PodcastGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {podcasts.map((podcast) => (
        <PodcastCard key={podcast.id} podcast={podcast} />
      ))}
    </div>
  );
}

