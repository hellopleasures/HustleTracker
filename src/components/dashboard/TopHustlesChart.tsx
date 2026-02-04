'use client';

import { Card } from '@/components/ui';
import { formatCurrency } from '@/lib/utils/currency';

interface TopHustlesChartProps {
  hustles: {
    name: string;
    total: number;
    color: string;
  }[];
  currency: string;
}

export function TopHustlesChart({ hustles, currency }: TopHustlesChartProps) {
  const maxTotal = Math.max(...hustles.map((h) => h.total), 1);

  if (hustles.length === 0) {
    return (
      <Card>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
          Top Hustles This Month
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
          No income logged this month yet
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
        Top Hustles This Month
      </h3>
      <div className="space-y-4">
        {hustles.map((hustle, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {hustle.name}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formatCurrency(hustle.total, currency)}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${(hustle.total / maxTotal) * 100}%`,
                  backgroundColor: hustle.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
