'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

/**
 * Global error boundary that catches errors at the root level
 * This is a last resort error handler
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error caught:', error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
          {/* Critical error SVG */}
          <div className="mb-8 w-full max-w-sm">
            <svg
              viewBox="0 0 800 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
            >
              {/* Red alert background */}
              <circle cx="400" cy="300" r="200" fill="#ef4444" opacity="0.05" />
              <circle cx="400" cy="300" r="150" fill="#ef4444" opacity="0.08" />
              <circle cx="400" cy="300" r="100" fill="#ef4444" opacity="0.12" />
              
              {/* Large exclamation mark */}
              <circle cx="400" cy="300" r="80" stroke="#ef4444" strokeWidth="12" fill="white" />
              <rect x="390" y="250" width="20" height="60" rx="10" fill="#ef4444" />
              <circle cx="400" cy="335" r="10" fill="#ef4444" />
              
              {/* Danger symbols */}
              <g opacity="0.3">
                <path d="M 300 250 L 280 290 L 320 290 Z" fill="#ef4444" />
                <path d="M 500 250 L 480 290 L 520 290 Z" fill="#ef4444" />
                <path d="M 320 400 L 300 440 L 340 440 Z" fill="#ef4444" />
                <path d="M 480 400 L 460 440 L 500 440 Z" fill="#ef4444" />
              </g>
              
              {/* ERROR text */}
              <text
                x="400"
                y="520"
                fontSize="80"
                fontWeight="bold"
                fill="#ef4444"
                textAnchor="middle"
                opacity="0.15"
              >
                ERROR
              </text>
            </svg>
          </div>

          <div className="mb-3 inline-block rounded-lg bg-red-100 px-4 py-1.5 dark:bg-red-900/30">
            <span className="text-sm font-semibold text-red-600 dark:text-red-400">
              خطأ حرج
            </span>
          </div>

          <h1 className="mb-3 text-4xl font-bold md:text-5xl">عذراً، حدث خطأ خطير</h1>
          
          <p className="mb-4 max-w-md text-lg text-gray-600 dark:text-gray-400">
            حدث خطأ غير متوقع في التطبيق. نعتذر عن الإزعاج.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <details className="mb-8 max-w-2xl rounded-lg border border-red-200 bg-red-50 p-4 text-right dark:border-red-900/50 dark:bg-red-900/20">
              <summary className="cursor-pointer text-sm font-medium text-red-800 dark:text-red-200">
                التفاصيل التقنية (بيئة التطوير فقط)
              </summary>
              <pre className="mt-3 overflow-auto text-left text-xs text-red-700 dark:text-red-300">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button 
              onClick={() => reset()} 
              size="lg"
              className="bg-red-600 hover:bg-red-700"
            >
              إعادة تحميل التطبيق
            </Button>
            <Button 
              onClick={() => window.location.href = '/'} 
              variant="outline" 
              size="lg"
            >
              العودة للرئيسية
            </Button>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            إذا استمرت المشكلة، يرجى تحديث الصفحة أو الاتصال بالدعم الفني.
          </p>
        </div>
      </body>
    </html>
  );
}

