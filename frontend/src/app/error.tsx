'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/Container';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container>
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-6">
          <AlertCircle className="h-16 w-16 text-destructive" />
        </div>
        <h2 className="mb-2 text-2xl font-bold">حدث خطأ ما!</h2>
        <p className="mb-6 text-muted-foreground">
          واجهنا خطأ أثناء تحميل هذه الصفحة.
        </p>
        <Button onClick={() => reset()}>حاول مرة أخرى</Button>
      </div>
    </Container>
  );
}

