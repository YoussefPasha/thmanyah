'use client';

import React from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Filter,
  X,
  Search as SearchIcon,
  ChevronDown,
  Calendar as CalendarIcon,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Clock,
  Music2,
  User,
  Mic,
  ListMusic,
  SlidersHorizontal,
} from 'lucide-react';
import { PodcastSortBy, SortOrder } from '@/types/api.types';
import { cn } from '@/lib/utils/cn';

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
    releaseDateFrom?: string;
    releaseDateTo?: string;
  };
  onFilterChange: (filters: any) => void;
  onReset: () => void;
}

const SORT_OPTIONS = [
  { value: PodcastSortBy.CREATED_AT, label: 'تاريخ الإضافة', icon: Clock },
  { value: PodcastSortBy.RELEASE_DATE, label: 'تاريخ الإصدار', icon: CalendarIcon },
  { value: PodcastSortBy.TRACK_NAME, label: 'الاسم', icon: Music2 },
  { value: PodcastSortBy.ARTIST_NAME, label: 'المنشئ', icon: User },
  { value: PodcastSortBy.TRACK_COUNT, label: 'عدد الحلقات', icon: ListMusic },
];

export function PodcastFilters({
  genres,
  countries,
  filters,
  onFilterChange,
  onReset,
}: PodcastFiltersProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [dateFrom, setDateFrom] = React.useState<Date | undefined>(
    filters.releaseDateFrom ? new Date(filters.releaseDateFrom) : undefined
  );
  const [dateTo, setDateTo] = React.useState<Date | undefined>(
    filters.releaseDateTo ? new Date(filters.releaseDateTo) : undefined
  );

  const activeFiltersCount = Object.entries(filters).filter(
    ([key, v]) => v !== undefined && v !== '' && key !== 'sortBy' && key !== 'sortOrder'
  ).length;

  const currentSortOption = SORT_OPTIONS.find((opt) => opt.value === (filters.sortBy || PodcastSortBy.CREATED_AT));

  const handleDateFromChange = (date: Date | undefined) => {
    setDateFrom(date);
    onFilterChange({
      ...filters,
      releaseDateFrom: date ? date.toISOString() : undefined,
    });
  };

  const handleDateToChange = (date: Date | undefined) => {
    setDateTo(date);
    onFilterChange({
      ...filters,
      releaseDateTo: date ? date.toISOString() : undefined,
    });
  };

  const clearDateFilter = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    onFilterChange({
      ...filters,
      releaseDateFrom: undefined,
      releaseDateTo: undefined,
    });
  };

  const FiltersContent = () => (
    <>
      {/* Genre Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">التصنيف</label>
        <select
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
        <label className="text-sm font-medium text-foreground">البلد</label>
        <select
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

      {/* Date Range Filter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">تاريخ الإصدار</label>
          {(dateFrom || dateTo) && (
            <button
              onClick={clearDateFilter}
              className="text-xs font-medium text-primary hover:text-primary/80"
            >
              مسح
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-10 flex-1 justify-start rounded-lg text-right font-normal',
                  !dateFrom && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="ml-2 h-4 w-4" />
                <span className="text-sm">{dateFrom ? format(dateFrom, 'PP', { locale: ar }) : 'من'}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={handleDateFromChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-10 flex-1 justify-start rounded-lg text-right font-normal',
                  !dateTo && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="ml-2 h-4 w-4" />
                <span className="text-sm">{dateTo ? format(dateTo, 'PP', { locale: ar }) : 'إلى'}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={handleDateToChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Explicit Content Filter */}
      <div className="flex items-end">
        <label className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent">
          <input
            type="checkbox"
            checked={filters.explicitContent === true}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                explicitContent: e.target.checked ? true : undefined,
              })
            }
            className="h-4 w-4 rounded border-gray-300"
          />
          <span>محتوى صريح</span>
        </label>
      </div>
    </>
  );

  return (
    <div className="space-y-3">
      {/* Main Filter Bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
        {/* Search + Mobile Filter Button */}
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ابحث في البودكاست..."
              value={filters.search || ''}
              onChange={(e) =>
                onFilterChange({ ...filters, search: e.target.value })
              }
              className="h-9 pr-10"
            />
          </div>

          {/* Mobile Filter Sheet Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2 md:hidden">
                <SlidersHorizontal className="h-4 w-4" />
                <span>فلاتر</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="default" className="h-5 w-5 p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] overflow-y-auto sm:w-[380px]">
              <SheetHeader className="mb-8">
                <SheetTitle className="text-right text-xl font-bold">فلاتر البحث</SheetTitle>
              </SheetHeader>
              <div className="space-y-8">
                {/* Mobile Sort Options */}
                <div className="space-y-4">
                  <h4 className="text-base font-semibold text-foreground">الترتيب</h4>
                  <div className="space-y-2">
                    {SORT_OPTIONS.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() =>
                            onFilterChange({
                              ...filters,
                              sortBy: option.value as PodcastSortBy,
                            })
                          }
                          className={cn(
                            'flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-all hover:bg-accent',
                            filters.sortBy === option.value && 'border-primary bg-primary/5 text-primary'
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <ToggleGroup
                    type="single"
                    value={filters.sortOrder || SortOrder.DESC}
                    onValueChange={(value) => {
                      if (value) {
                        onFilterChange({
                          ...filters,
                          sortOrder: value as SortOrder,
                        });
                      }
                    }}
                    className="grid w-full grid-cols-2 gap-2"
                  >
                    <ToggleGroupItem value={SortOrder.ASC} aria-label="تصاعدي" className="h-10 text-sm font-medium">
                      <ArrowUp className="ml-2 h-4 w-4" />
                      تصاعدي
                    </ToggleGroupItem>
                    <ToggleGroupItem value={SortOrder.DESC} aria-label="تنازلي" className="h-10 text-sm font-medium">
                      <ArrowDown className="ml-2 h-4 w-4" />
                      تنازلي
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                {/* Mobile Filters */}
                <div className="space-y-4">
                  <h4 className="text-base font-semibold text-foreground">تصفية النتائج</h4>
                  <div className="grid grid-cols-1 gap-5">
                    <FiltersContent />
                  </div>
                </div>

                {/* Reset Button */}
                {activeFiltersCount > 0 && (
                  <Button
                    variant="outline"
                    onClick={onReset}
                    className="w-full gap-2 text-sm font-medium"
                    size="lg"
                  >
                    <X className="h-4 w-4" />
                    مسح جميع الفلاتر
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sort Controls */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Sort By Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2">
                {currentSortOption && <currentSortOption.icon className="h-4 w-4" />}
                <span className="hidden lg:inline">{currentSortOption?.label}</span>
                <ArrowUpDown className="h-3 w-3 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="end">
              <div className="space-y-1">
                {SORT_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() =>
                        onFilterChange({
                          ...filters,
                          sortBy: option.value as PodcastSortBy,
                        })
                      }
                      className={cn(
                        'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent',
                        filters.sortBy === option.value && 'bg-accent font-medium'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          {/* Sort Order Toggle Buttons */}
          <ToggleGroup
            type="single"
            value={filters.sortOrder || SortOrder.DESC}
            onValueChange={(value) => {
              if (value) {
                onFilterChange({
                  ...filters,
                  sortOrder: value as SortOrder,
                });
              }
            }}
            className="border rounded-md"
          >
            <ToggleGroupItem value={SortOrder.ASC} aria-label="تصاعدي" className="h-9 w-9 p-0" size="sm">
              <ArrowUp className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value={SortOrder.DESC} aria-label="تنازلي" className="h-9 w-9 p-0" size="sm">
              <ArrowDown className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Desktop Filter Toggle Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="hidden h-9 gap-2 md:flex"
        >
          <Filter className="h-4 w-4" />
          <span className="hidden lg:inline">فلاتر</span>
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="h-5 w-5 p-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
          <ChevronDown className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')} />
        </Button>

        {/* Desktop Reset Button */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="hidden h-9 gap-1 md:flex"
          >
            <X className="h-4 w-4" />
            <span className="hidden lg:inline">مسح</span>
          </Button>
        )}
      </div>

      {/* Desktop Expanded Filters */}
      {isExpanded && (
        <div className="hidden animate-in slide-in-from-top-2 rounded-lg border bg-card p-3 shadow-sm md:block">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <FiltersContent />
          </div>
        </div>
      )}
    </div>
  );
}

