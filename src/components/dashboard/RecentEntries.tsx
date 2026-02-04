import { Card } from '@/components/ui';
import { formatCurrency } from '@/lib/utils/currency';
import { format } from 'date-fns';
import Link from 'next/link';
import type { IncomeEntryWithHustle } from '@/types/database';

interface RecentEntriesProps {
  entries: IncomeEntryWithHustle[];
  currency: string;
}

export function RecentEntries({ entries, currency }: RecentEntriesProps) {
  if (entries.length === 0) {
    return (
      <Card>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
          Recent Income
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
          No income logged yet.{' '}
          <Link href="/log" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Log your first income
          </Link>
        </p>
      </Card>
    );
  }

  return (
    <Card padding="none">
      <div className="p-4 sm:p-6 pb-0 sm:pb-0">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
          Recent Income
        </h3>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="px-4 sm:px-6 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.hustle.color }}
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {entry.hustle.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {format(new Date(entry.date), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
              +{formatCurrency(entry.amount, currency)}
            </span>
          </div>
        ))}
      </div>
      <div className="p-4 sm:p-6 pt-2 sm:pt-2">
        <Link
          href="/history"
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          View all history →
        </Link>
      </div>
    </Card>
  );
}
