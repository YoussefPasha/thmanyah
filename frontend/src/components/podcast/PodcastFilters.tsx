'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Filter, X, Search as SearchIcon } from 'lucide-react';
import { PodcastSortBy, SortOrder } from '@/types/api.types';

interface PodcastFiltersProps {
  genres: string[];
  countries: string[];
  filters: {
    search?: string;
    genre?: string;
    country?: string;
    sortBy?: PodcastSortBy;
    sortOrder?: SortOrder;
    explicitContent?: boolean;
  };
  onFilterChange: (filters: any) => void;
  onReset: () => void;
}

const SORT_OPTIONS = [
  { value: PodcastSortBy.CREATED_AT, label: 'تاريخ الإضافة' },
  { value: PodcastSortBy.RELEASE_DATE, label: 'تاريخ الإصدار' },
  { value: PodcastSortBy.TRACK_NAME, label: 'الاسم' },
  { value: PodcastSortBy.ARTIST_NAME, label: 'المنشئ' },
  { value: PodcastSortBy.TRACK_COUNT, label: 'عدد الحلقات' },
];

const SORT_ORDER_OPTIONS = [
  { value: SortOrder.DESC, label: 'تنازلي' },
  { value: SortOrder.ASC, label: 'تصاعدي' },
];

export function PodcastFilters({
  genres,
  countries,
  filters,
  onFilterChange,
  onReset,
}: PodcastFiltersProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== ''
  ).length;

  return (
    <Card className="border-2">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">الفلاتر</h3>
              {activeFiltersCount > 0 && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onReset}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  مسح الفلاتر
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'إخفاء' : 'عرض المزيد'}
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <SearchIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ابحث في البودكاست..."
              value={filters.search || ''}
              onChange={(e) =>
                onFilterChange({ ...filters, search: e.target.value })
              }
              className="pr-10"
            />
          </div>

          {/* Sort Options */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">ترتيب حسب</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={filters.sortBy || PodcastSortBy.CREATED_AT}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    sortBy: e.target.value as PodcastSortBy,
                  })
                }
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">الترتيب</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={filters.sortOrder || SortOrder.DESC}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    sortOrder: e.target.value as SortOrder,
                  })
                }
              >
                {SORT_ORDER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Expanded Filters */}
          {isExpanded && (
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Genre Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">التصنيف</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={filters.genre || ''}
                    onChange={(e) =>
                      onFilterChange({
                        ...filters,
                        genre: e.target.value || undefined,
                      })
                    }
                  >
                    <option value="">جميع التصنيفات</option>
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Country Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">البلد</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={filters.country || ''}
                    onChange={(e) =>
                      onFilterChange({
                        ...filters,
                        country: e.target.value || undefined,
                      })
                    }
                  >
                    <option value="">جميع البلدان</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Explicit Content Filter */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="checkbox"
                  id="explicit"
                  checked={filters.explicitContent === true}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      explicitContent: e.target.checked ? true : undefined,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label
                  htmlFor="explicit"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  عرض المحتوى الصريح فقط
                </label>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

