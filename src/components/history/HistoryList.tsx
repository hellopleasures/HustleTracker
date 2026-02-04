'use client';

import { useState } from 'react';
import { Card, Button } from '@/components/ui';
import { EditEntryModal } from './EditEntryModal';
import { deleteIncomeEntry } from '@/lib/actions/income';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency } from '@/lib/utils/currency';
import { format } from 'date-fns';
import type { IncomeEntryWithHustle, Hustle } from '@/types/database';

interface HistoryListProps {
  entries: IncomeEntryWithHustle[];
  hustles: Hustle[];
  currency: string;
}

export function HistoryList({ entries, hustles, currency }: HistoryListProps) {
  const [editingEntry, setEditingEntry] = useState<IncomeEntryWithHustle | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { showToast } = useToast();

  async function handleDelete(entryId: string) {
    setDeletingId(entryId);
    const result = await deleteIncomeEntry(entryId);

    if (result.error) {
      showToast(result.error, 'error');
    } else {
      showToast('Entry deleted', 'success');
    }

    setDeletingId(null);
  }

  if (entries.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No entries found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            No income entries match your current filters.
          </p>
        </div>
      </Card>
    );
  }

  // Group entries by date
  const groupedEntries = entries.reduce((groups, entry) => {
    const date = entry.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, IncomeEntryWithHustle[]>);

  return (
    <>
      <div className="space-y-6">
        {Object.entries(groupedEntries).map(([date, dateEntries]) => (
          <div key={date}>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              {format(new Date(date), 'EEEE, MMMM d, yyyy')}
            </h3>
            <Card padding="none">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {dateEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.hustle.color }}
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {entry.hustle.name}
                        </p>
                        {entry.note && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {entry.note}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        +{formatCurrency(entry.amount, currency)}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingEntry(entry)}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                          loading={deletingId === entry.id}
                        >
                          <svg
                            className="w-4 h-4 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ))}
      </div>

      {editingEntry && (
        <EditEntryModal
          entry={editingEntry}
          hustles={hustles}
          onClose={() => setEditingEntry(null)}
        />
      )}
    </>
  );
}
