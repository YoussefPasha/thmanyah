import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/Container';
import { PodcastDetails } from '@/components/podcast/PodcastDetails';
import { podcastApi } from '@/lib/api/podcast.api';

interface PodcastPageProps {
  params: {
    id: string;
  };
}

export default async function PodcastPage({ params }: PodcastPageProps) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    notFound();
  }

  let podcast;
  try {
    podcast = await podcastApi.getById(id);
  } catch (error) {
    notFound();
  }

  return (
    <Container>
      <div className="space-y-6">
        <Button variant="ghost" asChild>
          <Link href="/search" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            العودة إلى البحث
          </Link>
        </Button>
        <PodcastDetails podcast={podcast} />
      </div>
    </Container>
  );
}

