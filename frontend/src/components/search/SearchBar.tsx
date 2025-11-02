'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { DEBOUNCE_DELAY } from '@/lib/constants/app.constants';

interface SearchBarProps {
  placeholder?: string;
  defaultValue?: string;
}

export function SearchBar({
  placeholder = 'ابحث عن البودكاست...',
  defaultValue = '',
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY);
  const isInitialMount = useRef(true);
  const lastSearchedTerm = useRef<string>('');
  const router = useRouter();

  // Sync with defaultValue when it changes (e.g., from URL)
  useEffect(() => {
    setSearchTerm(defaultValue);
    lastSearchedTerm.current = defaultValue;
  }, [defaultValue]);

  useEffect(() => {
    // Skip initial mount to avoid double search on page load
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (debouncedSearchTerm.trim().length >= 2) {
        lastSearchedTerm.current = debouncedSearchTerm.trim();
      }
      return;
    }

    // Only trigger search if term is valid and different from last search
    const trimmedTerm = debouncedSearchTerm.trim();
    if (trimmedTerm.length >= 2 && trimmedTerm !== lastSearchedTerm.current) {
      lastSearchedTerm.current = trimmedTerm;
      router.push(`/search?q=${encodeURIComponent(trimmedTerm)}`);
    }
  }, [debouncedSearchTerm, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm.length >= 2) {
      lastSearchedTerm.current = trimmedTerm;
      router.push(`/search?q=${encodeURIComponent(trimmedTerm)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <Button type="submit" disabled={searchTerm.trim().length < 2}>
          بحث
        </Button>
      </div>
      {searchTerm.trim().length > 0 && searchTerm.trim().length < 2 && (
        <p className="mt-2 text-sm text-muted-foreground">
          الرجاء إدخال حرفين على الأقل
        </p>
      )}
    </form>
  );
}

