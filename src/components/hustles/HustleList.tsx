'use client';

import { useState } from 'react';
import { Card, Button } from '@/components/ui';
import { HustleCard } from './HustleCard';
import { AddHustleModal } from './AddHustleModal';
import type { Hustle } from '@/types/database';

interface HustleListProps {
  hustles: Hustle[];
}

export function HustleList({ hustles }: HustleListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          My Hustles ({hustles.length})
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
            <HustleCard key={hustle.id} hustle={hustle} />
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
