'use client';

import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '@/lib/actions/profile';
import { Button, Input, Select, Card, CardTitle } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { useTheme } from '@/contexts/theme-context';
import { CURRENCIES } from '@/lib/utils/currency';
import type { Profile } from '@/types/database';

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  const currencyOptions = CURRENCIES.map((c) => ({
    value: c.code,
    label: `${c.symbol} ${c.code} - ${c.name}`,
  }));

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];

  async function handleProfileSubmit(formData: FormData) {
    setLoading(true);

    const result = await updateProfile(formData);

    if (result.error) {
      showToast(result.error, 'error');
    } else {
      showToast('Settings saved!', 'success');
      const updatedProfile = await getProfile();
      setProfile(updatedProfile);
    }

    setLoading(false);
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account preferences
        </p>
      </div>

      <Card>
        <CardTitle className="mb-4">Profile</CardTitle>
        <form action={handleProfileSubmit} className="space-y-4">
          <Input
            id="fullName"
            name="fullName"
            label="Full Name"
            defaultValue={profile.full_name || ''}
          />
          <Input
            id="email"
            label="Email"
            defaultValue={profile.email}
            disabled
            className="bg-gray-50 dark:bg-gray-700"
          />
          <Button type="submit" loading={loading}>
            Save Profile
          </Button>
        </form>
      </Card>

      <Card>
        <CardTitle className="mb-4">Income Settings</CardTitle>
        <form action={handleProfileSubmit} className="space-y-4">
          <Select
            id="currency"
            name="currency"
            label="Currency"
            options={currencyOptions}
            defaultValue={profile.currency}
          />
          <Input
            id="monthlyGoal"
            name="monthlyGoal"
            type="number"
            label="Monthly Goal"
            min="0"
            step="1"
            defaultValue={profile.monthly_goal}
          />
          <Button type="submit" loading={loading}>
            Save Settings
          </Button>
        </form>
      </Card>

      <Card>
        <CardTitle className="mb-4">Appearance</CardTitle>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Theme
            </label>
            <div className="flex gap-2">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTheme(option.value as 'light' | 'dark' | 'system')}
                  className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    theme === option.value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle className="mb-4">Account</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Member since{' '}
          {new Date(profile.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </Card>
    </div>
  );
}
