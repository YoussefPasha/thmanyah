'use client';

import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { DEBOUNCE_DELAY } from '@/lib/constants/app.constants';

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  defaultValue?: string;
}

export function SearchBar({
  onSearch,
  placeholder = 'ابحث عن البودكاست...',
  defaultValue = '',
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY);

  // Sync with defaultValue when it changes (e.g., from URL)
  useEffect(() => {
    if (defaultValue) {
      setSearchTerm(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (debouncedSearchTerm.trim().length >= 2) {
      onSearch(debouncedSearchTerm.trim());
    }
  }, [debouncedSearchTerm, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim().length >= 2) {
      onSearch(searchTerm.trim());
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

