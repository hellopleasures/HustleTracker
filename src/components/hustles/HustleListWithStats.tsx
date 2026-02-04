'use client';

import { useState } from 'react';
import { Card, Button } from '@/components/ui';
import { AddHustleModal } from './AddHustleModal';
import { deleteHustle } from '@/lib/actions/hustles';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency } from '@/lib/utils/currency';
import type { HustleWithStats } from '@/lib/actions/hustles';

interface HustleListWithStatsProps {
  hustles: HustleWithStats[];
  currency: string;
}

export function HustleListWithStats({ hustles, currency }: HustleListWithStatsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          All Hustles ({hustles.length})
        </h2>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Hustle
        </Button>
      </div>

      {hustles.length === 0 ? (
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No hustles yet
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by adding your first side hustle.
            </p>
            <div className="mt-6">
              <Button onClick={() => setIsModalOpen(true)}>
                Add Your First Hustle
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hustles.map((hustle) => (
            <HustleCardWithStats
              key={hustle.id}
              hustle={hustle}
              currency={currency}
            />
          ))}
        </div>
      )}

      <AddHustleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

function HustleCardWithStats({
  hustle,
  currency,
}: {
  hustle: HustleWithStats;
  currency: string;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteHustle(hustle.id);

    if (result.error) {
      showToast(result.error, 'error');
    } else {
      showToast('Hustle deleted', 'success');
    }

    setDeleting(false);
    setShowDeleteConfirm(false);
  }

  return (
    <Card className="relative">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: hustle.color }}
          />
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {hustle.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {hustle.category}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <svg
            className="w-5 h-5"
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
        </button>
      </div>

      <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">This month</span>
          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
            {formatCurrency(hustle.monthlyTotal, currency)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">All time</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {formatCurrency(hustle.allTimeTotal, currency)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">Entries</span>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {hustle.entryCount}
          </span>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center p-4">
          <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-4">
            Delete &quot;{hustle.name}&quot;?
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              loading={deleting}
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
