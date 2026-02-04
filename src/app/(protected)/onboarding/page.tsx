'use client';

import { useState } from 'react';
import { completeOnboarding } from '@/lib/actions/profile';
import { Button, Input, Select, Card } from '@/components/ui';
import { CURRENCIES } from '@/lib/utils/currency';

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [currency, setCurrency] = useState('USD');

  const currencyOptions = CURRENCIES.map((c) => ({
    value: c.code,
    label: `${c.symbol} ${c.code} - ${c.name}`,
  }));

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await completeOnboarding(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 -mt-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">$</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to HustleTracker!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Let&apos;s set up your account in just a few steps
          </p>
        </div>

        <Card>
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-6">
            {/* Always include currency as hidden input */}
            <input type="hidden" name="currency" value={currency} />

            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex items-center justify-center w-6 h-6 bg-indigo-600 text-white text-sm font-medium rounded-full">
                    1
                  </span>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Choose your currency
                  </span>
                </div>
                <Select
                  id="currency-select"
                  label="Preferred Currency"
                  options={currencyOptions}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full"
                >
                  Continue
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex items-center justify-center w-6 h-6 bg-indigo-600 text-white text-sm font-medium rounded-full">
                    2
                  </span>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Set your monthly goal
                  </span>
                </div>
                <Input
                  id="monthlyGoal"
                  name="monthlyGoal"
                  type="number"
                  label="Monthly Income Goal"
                  placeholder="1000"
                  min="0"
                  step="1"
                  defaultValue="1000"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This is the amount you want to earn each month from your side
                  hustles. You can change this later.
                </p>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button type="submit" loading={loading} className="flex-1">
                    Get Started
                  </Button>
                </div>
              </div>
            )}
          </form>

          <div className="flex justify-center gap-2 mt-6">
            <div
              className={`w-2 h-2 rounded-full ${
                step === 1 ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
            <div
              className={`w-2 h-2 rounded-full ${
                step === 2 ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
