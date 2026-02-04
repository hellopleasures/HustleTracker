'use client';

import { useState } from 'react';
import { Modal, Button, Input, Select } from '@/components/ui';
import { updateIncomeEntry } from '@/lib/actions/income';
import { useToast } from '@/components/ui/Toast';
import type { IncomeEntryWithHustle, Hustle } from '@/types/database';

interface EditEntryModalProps {
  entry: IncomeEntryWithHustle;
  hustles: Hustle[];
  onClose: () => void;
}

export function EditEntryModal({
  entry,
  hustles,
  onClose,
}: EditEntryModalProps) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const hustleOptions = hustles.map((h) => ({
    value: h.id,
    label: h.name,
  }));

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    const result = await updateIncomeEntry(entry.id, formData);

    if (result.error) {
      showToast(result.error, 'error');
    } else {
      showToast('Entry updated!', 'success');
      onClose();
    }

    setLoading(false);
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Entry">
      <form action={handleSubmit} className="space-y-4">
        <Select
          id="hustleId"
          name="hustleId"
          label="Hustle"
          options={hustleOptions}
          defaultValue={entry.hustle_id}
        />

        <Input
          id="amount"
          name="amount"
          type="number"
          label="Amount"
          step="0.01"
          min="0.01"
          defaultValue={entry.amount}
          required
        />

        <Input
          id="date"
          name="date"
          type="date"
          label="Date"
          defaultValue={entry.date}
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
            defaultValue={entry.note || ''}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
