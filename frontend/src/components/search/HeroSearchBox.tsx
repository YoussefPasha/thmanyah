'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function HeroSearchBox() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm.length >= 2) {
      router.push(`/search?q=${encodeURIComponent(trimmedTerm)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <div className="relative">
        <div className="relative flex items-center gap-3 rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-black/5 transition-all hover:shadow-3xl focus-within:ring-2 focus-within:ring-primary">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <SearchIcon className="h-6 w-6 text-primary" />
          </div>
          <Input
            type="text"
            placeholder="ابحث عن البودكاست بالاسم أو الموضوع أو المنشئ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border-0 bg-transparent text-lg placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button 
            type="submit" 
            size="lg"
            disabled={searchTerm.trim().length < 2}
            className="gap-2 rounded-xl px-6 text-base font-semibold"
          >
            <Sparkles className="h-5 w-5" />
            بحث
          </Button>
        </div>
        {searchTerm.trim().length > 0 && searchTerm.trim().length < 2 && (
          <p className="mt-3 text-center text-sm text-muted-foreground">
            الرجاء إدخال حرفين على الأقل للبحث
          </p>
        )}
      </div>
    </form>
  );
}

