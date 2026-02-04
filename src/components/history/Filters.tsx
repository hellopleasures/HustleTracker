'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select } from '@/components/ui';
import { format, subMonths } from 'date-fns';
import type { Hustle } from '@/types/database';

interface FiltersProps {
  hustles: Hustle[];
}

export function Filters({ hustles }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentHustle = searchParams.get('hustle') || '';
  const currentMonth = searchParams.get('month') || '';

  const hustleOptions = [
    { value: '', label: 'All Hustles' },
    ...hustles.map((h) => ({
      value: h.id,
      label: h.name,
    })),
  ];

  // Generate last 12 months
  const monthOptions = [
    { value: '', label: 'All Time' },
    ...Array.from({ length: 12 }, (_, i) => {
      const date = subMonths(new Date(), i);
      return {
        value: format(date, 'yyyy-MM'),
        label: format(date, 'MMMM yyyy'),
      };
    }),
  ];

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/history?${params.toString()}`);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Select
          id="hustle-filter"
          options={hustleOptions}
          value={currentHustle}
          onChange={(e) => updateFilter('hustle', e.target.value)}
        />
      </div>
      <div className="flex-1">
        <Select
          id="month-filter"
          options={monthOptions}
          value={currentMonth}
          onChange={(e) => updateFilter('month', e.target.value)}
        />
      </div>
    </div>
  );
}
