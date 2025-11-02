'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Music, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center space-x-2 space-x-reverse">
          <div className="rounded-lg bg-primary/10 p-1.5 transition-all group-hover:bg-primary/20">
            <Music className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-bold">بودكاست iTunes</span>
        </Link>
        <nav className="mr-auto flex items-center space-x-2 space-x-reverse md:space-x-4">
          <Link
            href="/"
            className={cn(
              "px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
              pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            الرئيسية
          </Link>
          <Button asChild variant={pathname === '/search' ? 'default' : 'ghost'} size="sm" className="gap-2">
            <Link href="/search">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">بحث</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

