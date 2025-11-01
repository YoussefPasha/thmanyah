import React from 'react';
import Link from 'next/link';
import { Music } from 'lucide-react';
import { APP_NAME } from '@/lib/constants/app.constants';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Music className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">{APP_NAME}</span>
        </Link>
        <nav className="ml-auto flex items-center space-x-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/search"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Search
          </Link>
        </nav>
      </div>
    </header>
  );
}

