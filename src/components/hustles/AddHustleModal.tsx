'use client';

import { useState } from 'react';
import { Modal, Button, Input, Select } from '@/components/ui';
import { createHustle } from '@/lib/actions/hustles';
import { HUSTLE_CATEGORIES, HUSTLE_COLORS } from '@/lib/utils/constants';
import { useToast } from '@/components/ui/Toast';

interface AddHustleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddHustleModal({ isOpen, onClose }: AddHustleModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(HUSTLE_COLORS[0]);
  const { showToast } = useToast();

  const categoryOptions = HUSTLE_CATEGORIES.map((cat) => ({
    value: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
  }));

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    formData.set('color', selectedColor);

    const result = await createHustle(formData);

    if (result.error) {
      showToast(result.error, 'error');
    } else {
      showToast('Hustle created!', 'success');
      onClose();
    }

    setLoading(false);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Hustle">
      <form action={handleSubmit} className="space-y-4">
        <Input
          id="name"
          name="name"
          label="Hustle Name"
          placeholder="e.g., Freelance Writing"
          required
          maxLength={50}
        />

        <Select
          id="category"
          name="category"
          label="Category"
          options={categoryOptions}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {HUSTLE_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full transition-transform ${
                  selectedColor === color
                    ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
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
            Add Hustle
          </Button>
        </div>
      </form>
    </Modal>
  );
}
