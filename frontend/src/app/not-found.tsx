import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/Container';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <Container>
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center text-center">
        {/* Cool 404 SVG Animation */}
        <div className="mb-8 w-full max-w-md animate-float">
          <svg
            viewBox="0 0 800 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            {/* Background circles */}
            <circle cx="400" cy="300" r="200" fill="hsl(var(--primary))" opacity="0.05" />
            <circle cx="400" cy="300" r="150" fill="hsl(var(--primary))" opacity="0.08" />
            <circle cx="400" cy="300" r="100" fill="hsl(var(--primary))" opacity="0.1" />
            
            {/* Large 404 Text */}
            <text
              x="400"
              y="300"
              fontSize="140"
              fontWeight="bold"
              fill="hsl(var(--primary))"
              textAnchor="middle"
              dominantBaseline="middle"
              opacity="0.15"
            >
              404
            </text>

            {/* Confused character - head */}
            <circle cx="400" cy="280" r="60" fill="hsl(var(--primary))" opacity="0.9" />
            
            {/* Eyes */}
            <circle cx="380" cy="270" r="8" fill="white" />
            <circle cx="420" cy="270" r="8" fill="white" />
            <circle cx="383" cy="270" r="4" fill="hsl(var(--foreground))" />
            <circle cx="423" cy="270" r="4" fill="hsl(var(--foreground))" />
            
            {/* Confused mouth */}
            <path
              d="M 370 295 Q 400 300 430 295"
              stroke="white"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />

            {/* Question marks floating around */}
            <g opacity="0.6">
              <text x="320" y="240" fontSize="40" fill="hsl(var(--primary))">؟</text>
              <text x="480" y="250" fontSize="35" fill="hsl(var(--primary))">؟</text>
              <text x="350" y="380" fontSize="30" fill="hsl(var(--primary))">؟</text>
              <text x="460" y="360" fontSize="38" fill="hsl(var(--primary))">؟</text>
            </g>

            {/* Magnifying glass searching */}
            <g transform="translate(520, 380)">
              <circle cx="0" cy="0" r="35" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="6" />
              <line x1="25" y1="25" x2="50" y2="50" stroke="hsl(var(--muted-foreground))" strokeWidth="6" strokeLinecap="round" />
              <text x="-10" y="8" fontSize="24">✕</text>
            </g>

            {/* Decorative dots */}
            <circle cx="280" cy="320" r="4" fill="hsl(var(--primary))" opacity="0.4" />
            <circle cx="520" cy="310" r="6" fill="hsl(var(--primary))" opacity="0.3" />
            <circle cx="300" cy="450" r="5" fill="hsl(var(--primary))" opacity="0.35" />
            <circle cx="500" cy="440" r="4" fill="hsl(var(--primary))" opacity="0.4" />
          </svg>
        </div>

        {/* Text content */}
        <h1 className="mb-3 text-4xl font-bold md:text-5xl animate-fade-in-up">الصفحة غير موجودة</h1>
        <p className="mb-8 max-w-md text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى موقع آخر.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 sm:flex-row animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-5 w-5" />
              العودة للرئيسية
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/search">
              <Search className="h-5 w-5" />
              البحث عن بودكاست
            </Link>
          </Button>
        </div>

        {/* Helpful links */}
        <div className="mt-12 text-sm text-muted-foreground">
          <p className="mb-2">ربما تبحث عن:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/podcasts" className="hover:text-primary underline">
              جميع البودكاست
            </Link>
            <Link href="/search" className="hover:text-primary underline">
              البحث المتقدم
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}

