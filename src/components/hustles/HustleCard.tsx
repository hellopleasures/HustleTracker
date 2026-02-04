'use client';

import { useState } from 'react';
import { Card, Button, Modal } from '@/components/ui';
import { deleteHustle } from '@/lib/actions/hustles';
import { useToast } from '@/components/ui/Toast';
import type { Hustle } from '@/types/database';

interface HustleCardProps {
  hustle: Hustle;
}

export function HustleCard({ hustle }: HustleCardProps) {
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
    <>
      <Card className="relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: hustle.color }}
            />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {hustle.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
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
      </Card>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Hustle"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete &quot;{hustle.name}&quot;? This will hide it
          from your active hustles but keep your income history.
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => setShowDeleteConfirm(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={deleting}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
