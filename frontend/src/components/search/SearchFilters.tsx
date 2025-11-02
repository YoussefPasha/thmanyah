'use client';

import React from 'react';
import { Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ENTITY_OPTIONS, COUNTRY_OPTIONS, LIMIT_OPTIONS } from '@/lib/constants/api.constants';

export interface SearchFiltersProps {
  country: string;
  entity: string;
  limit: string;
  onCountryChange: (value: string) => void;
  onEntityChange: (value: string) => void;
  onLimitChange: (value: string) => void;
}

export function SearchFilters({
  country,
  entity,
  limit,
  onCountryChange,
  onEntityChange,
  onLimitChange,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Filter className="h-4 w-4" />
        <span>خيارات البحث</span>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Entity Type Filter */}
        <div className="space-y-2">
          <label htmlFor="entity-select" className="text-sm font-medium">
            نوع البحث
          </label>
          <Select value={entity} onValueChange={onEntityChange}>
            <SelectTrigger id="entity-select">
              <SelectValue placeholder="اختر نوع البحث" />
            </SelectTrigger>
            <SelectContent>
              {ENTITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Country Filter */}
        <div className="space-y-2">
          <label htmlFor="country-select" className="text-sm font-medium">
            الدولة
          </label>
          <Select value={country} onValueChange={onCountryChange}>
            <SelectTrigger id="country-select">
              <SelectValue placeholder="اختر الدولة" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Limit */}
        <div className="space-y-2">
          <label htmlFor="limit-select" className="text-sm font-medium">
            عدد النتائج
          </label>
          <Select value={limit} onValueChange={onLimitChange}>
            <SelectTrigger id="limit-select">
              <SelectValue placeholder="اختر عدد النتائج" />
            </SelectTrigger>
            <SelectContent>
              {LIMIT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        💡 iTunes API لا يدعم الانتقال بين الصفحات. لعرض المزيد من النتائج، قم بزيادة عدد النتائج أعلاه.
      </p>
    </div>
  );
}

