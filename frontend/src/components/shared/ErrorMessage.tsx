import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorMessageProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export function ErrorMessage({ title = 'خطأ', message, retry }: ErrorMessageProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {message}
        {retry && (
          <button
            onClick={retry}
            className="mr-2 underline hover:no-underline"
          >
            حاول مرة أخرى
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
}

