'use client';

import { Card } from '@/components/ui';
import { formatCurrency } from '@/lib/utils/currency';
import type { HustleWithStats } from '@/lib/actions/hustles';

interface HustleBarChartProps {
  hustles: HustleWithStats[];
  currency: string;
}

export function HustleBarChart({ hustles, currency }: HustleBarChartProps) {
  const maxTotal = Math.max(...hustles.map((h) => h.monthlyTotal), 1);
  const totalThisMonth = hustles.reduce((sum, h) => sum + h.monthlyTotal, 0);

  if (hustles.every((h) => h.monthlyTotal === 0)) {
    return null;
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Income by Hustle This Month
        </h3>
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          {formatCurrency(totalThisMonth, currency)}
        </span>
      </div>
      <div className="space-y-4">
        {hustles
          .filter((h) => h.monthlyTotal > 0)
          .map((hustle) => {
            const percentage = (hustle.monthlyTotal / totalThisMonth) * 100;
            return (
              <div key={hustle.id}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: hustle.color }}
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {hustle.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(hustle.monthlyTotal, currency)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${(hustle.monthlyTotal / maxTotal) * 100}%`,
                      backgroundColor: hustle.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </Card>
  );
}
