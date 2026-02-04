import { Card } from '@/components/ui';
import { formatCurrency } from '@/lib/utils/currency';

interface SummaryCardProps {
  title: string;
  amount: number;
  currency: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function SummaryCard({
  title,
  amount,
  currency,
  subtitle,
  trend,
}: SummaryCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(amount, currency)}
          </p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
        {trend && (
          <div
            className={`flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
              trend.isPositive
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {trend.isPositive ? '+' : ''}
            {trend.value}%
          </div>
        )}
      </div>
    </Card>
  );
}
