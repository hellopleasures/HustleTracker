'use client';

import { useState } from 'react';
import { createIncomeEntry } from '@/lib/actions/income';
import { Button, Input, Card } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { format } from 'date-fns';
import type { Hustle } from '@/types/database';

interface IncomeFormProps {
  hustles: Hustle[];
}

export function IncomeForm({ hustles }: IncomeFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedHustle, setSelectedHustle] = useState('');
  const { showToast } = useToast();

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    const result = await createIncomeEntry(formData);

    if (result.error) {
      showToast(result.error, 'error');
    } else {
      showToast('Income logged successfully!', 'success');
      setSelectedHustle('');
      // Reset form
      const form = document.getElementById('income-form') as HTMLFormElement;
      form?.reset();
    }

    setLoading(false);
  }

  if (hustles.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No hustles yet
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add a hustle first before logging income.
          </p>
          <div className="mt-6">
            <Button onClick={() => (window.location.href = '/hustles')}>
              Add Your First Hustle
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <form id="income-form" action={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Select Hustle
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {hustles.map((hustle) => (
              <button
                key={hustle.id}
                type="button"
                onClick={() => setSelectedHustle(hustle.id)}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  selectedHustle === hustle.id
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full mx-auto mb-1"
                  style={{ backgroundColor: hustle.color }}
                />
                <span className="text-gray-900 dark:text-white truncate block">
                  {hustle.name}
                </span>
              </button>
            ))}
          </div>
          <input type="hidden" name="hustleId" value={selectedHustle} />
        </div>

        <Input
          id="amount"
          name="amount"
          type="number"
          label="Amount"
          placeholder="0.00"
          step="0.01"
          min="0.01"
          required
        />

        <Input
          id="date"
          name="date"
          type="date"
          label="Date"
          defaultValue={format(new Date(), 'yyyy-MM-dd')}
          required
        />

        <div>
          <label
            htmlFor="note"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Note (optional)
          </label>
          <textarea
            id="note"
            name="note"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Add a note..."
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={loading}
          disabled={!selectedHustle}
        >
          Log Income
        </Button>
      </form>
    </Card>
  );
}
