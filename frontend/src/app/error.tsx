'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/Container';
import { Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';

// Detect error type
function getErrorType(error: Error): {
  title: string;
  description: string;
  code: string;
  isRateLimit: boolean;
} {
  const message = error.message.toLowerCase();
  
  if (message.includes('rate limit') || message.includes('429')) {
    return {
      title: 'تم تجاوز الحد المسموح',
      description: 'لقد تجاوزت الحد المسموح من الطلبات. يرجى الانتظار قليلاً قبل المحاولة مرة أخرى.',
      code: '429',
      isRateLimit: true,
    };
  }
  
  if (
    message.includes('network') || 
    message.includes('fetch') || 
    message.includes('unable to reach') ||
    message.includes('check your connection')
  ) {
    return {
      title: 'خطأ في الاتصال',
      description: 'تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.',
      code: '503',
      isRateLimit: false,
    };
  }
  
  if (message.includes('timeout')) {
    return {
      title: 'انتهت مهلة الطلب',
      description: 'استغرق الطلب وقتاً طويلاً. يرجى المحاولة مرة أخرى.',
      code: '504',
      isRateLimit: false,
    };
  }
  
  return {
    title: 'خطأ في الخادم',
    description: 'حدث خطأ غير متوقع. نحن نعمل على حل المشكلة.',
    code: '500',
    isRateLimit: false,
  };
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error boundary caught:', error);
  }, [error]);

  const errorInfo = getErrorType(error);

  return (
    <Container>
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center text-center">
        {/* Cool Error SVG */}
        <div className="mb-8 w-full max-w-md animate-pulse-subtle">
          {errorInfo.isRateLimit ? (
            // Rate Limit SVG
            <svg
              viewBox="0 0 800 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
            >
              {/* Background */}
              <circle cx="400" cy="300" r="180" fill="hsl(var(--destructive))" opacity="0.05" />
              <circle cx="400" cy="300" r="130" fill="hsl(var(--destructive))" opacity="0.08" />
              
              {/* Stopwatch/Clock */}
              <circle cx="400" cy="300" r="100" stroke="hsl(var(--destructive))" strokeWidth="8" fill="white" />
              <circle cx="400" cy="300" r="8" fill="hsl(var(--destructive))" />
              
              {/* Clock hand pointing to 12 (vertical) */}
              <line x1="400" y1="300" x2="400" y2="220" stroke="hsl(var(--destructive))" strokeWidth="6" strokeLinecap="round" />
              
              {/* Pause symbol overlaid */}
              <rect x="360" y="340" width="30" height="70" rx="5" fill="hsl(var(--destructive))" />
              <rect x="410" y="340" width="30" height="70" rx="5" fill="hsl(var(--destructive))" />
              
              {/* Speed lines indicating waiting */}
              <g opacity="0.4">
                <line x1="250" y1="280" x2="290" y2="290" stroke="hsl(var(--destructive))" strokeWidth="4" strokeLinecap="round" />
                <line x1="240" y1="320" x2="280" y2="320" stroke="hsl(var(--destructive))" strokeWidth="4" strokeLinecap="round" />
                <line x1="550" y1="280" x2="510" y2="290" stroke="hsl(var(--destructive))" strokeWidth="4" strokeLinecap="round" />
                <line x1="560" y1="320" x2="520" y2="320" stroke="hsl(var(--destructive))" strokeWidth="4" strokeLinecap="round" />
              </g>
              
              {/* "429" text in background */}
              <text
                x="400"
                y="510"
                fontSize="100"
                fontWeight="bold"
                fill="hsl(var(--destructive))"
                textAnchor="middle"
                opacity="0.15"
              >
                429
              </text>
            </svg>
          ) : (
            // 500 Error SVG
            <svg
              viewBox="0 0 800 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
            >
              {/* Background */}
              <circle cx="400" cy="300" r="180" fill="hsl(var(--destructive))" opacity="0.05" />
              <circle cx="400" cy="300" r="130" fill="hsl(var(--destructive))" opacity="0.08" />
              
              {/* Broken robot/server */}
              <rect x="320" y="240" width="160" height="140" rx="10" fill="hsl(var(--destructive))" opacity="0.9" />
              
              {/* Eyes (X X) */}
              <g opacity="0.9">
                <line x1="355" y1="275" x2="375" y2="295" stroke="white" strokeWidth="8" strokeLinecap="round" />
                <line x1="375" y1="275" x2="355" y2="295" stroke="white" strokeWidth="8" strokeLinecap="round" />
                <line x1="425" y1="275" x2="445" y2="295" stroke="white" strokeWidth="8" strokeLinecap="round" />
                <line x1="445" y1="275" x2="425" y2="295" stroke="white" strokeWidth="8" strokeLinecap="round" />
              </g>
              
              {/* Sad mouth */}
              <path
                d="M 350 340 Q 400 320 450 340"
                stroke="white"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
              
              {/* Antenna broken */}
              <line x1="400" y1="240" x2="400" y2="200" stroke="hsl(var(--destructive))" strokeWidth="6" strokeLinecap="round" />
              <circle cx="400" cy="195" r="8" fill="hsl(var(--destructive))" />
              
              {/* Lightning bolt (indicating error) */}
              <path
                d="M 385 180 L 395 160 L 390 160 L 400 140 L 405 165 L 400 165 L 395 180 Z"
                fill="hsl(var(--destructive))"
                opacity="0.7"
              />
              
              {/* Warning symbols */}
              <g opacity="0.4">
                <text x="280" y="270" fontSize="40" fill="hsl(var(--destructive))">!</text>
                <text x="510" y="270" fontSize="40" fill="hsl(var(--destructive))">!</text>
                <text x="320" y="420" fontSize="35" fill="hsl(var(--destructive))">!</text>
                <text x="470" y="420" fontSize="35" fill="hsl(var(--destructive))">!</text>
              </g>
              
              {/* Error code in background */}
              <text
                x="400"
                y="510"
                fontSize="100"
                fontWeight="bold"
                fill="hsl(var(--destructive))"
                textAnchor="middle"
                opacity="0.15"
              >
                {errorInfo.code}
              </text>
            </svg>
          )}
        </div>

        {/* Error content */}
        <div className="mb-2 inline-block rounded-lg bg-destructive/10 px-4 py-1.5 animate-fade-in-up">
          <span className="text-sm font-semibold text-destructive">
            خطأ {errorInfo.code}
          </span>
        </div>
        
        <h1 className="mb-3 text-4xl font-bold md:text-5xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>{errorInfo.title}</h1>
        
        <p className="mb-4 max-w-md text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {errorInfo.description}
        </p>

        {/* Technical details (collapsible in production) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-8 max-w-2xl rounded-lg border border-border bg-muted/50 p-4 text-right">
            <summary className="cursor-pointer text-sm font-medium">
              التفاصيل التقنية (بيئة التطوير فقط)
            </summary>
            <pre className="mt-3 overflow-auto text-xs text-muted-foreground">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3 sm:flex-row animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Button 
            onClick={() => reset()} 
            size="lg" 
            className="gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            حاول مرة أخرى
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-5 w-5" />
              العودة للرئيسية
            </Link>
          </Button>
        </div>

        {/* Additional help */}
        {errorInfo.isRateLimit && (
          <div className="mt-8 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-900/20 dark:text-yellow-200">
            <p className="font-medium">💡 نصيحة:</p>
            <p className="mt-1">
              يرجى الانتظار بضع ثوانٍ قبل إجراء المزيد من عمليات البحث. نحن نحد من الطلبات لضمان أداء أفضل للجميع.
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}

