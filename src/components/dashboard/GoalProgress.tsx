import { Card, ProgressBar } from '@/components/ui';
import { formatCurrency } from '@/lib/utils/currency';

interface GoalProgressProps {
  current: number;
  goal: number;
  currency: string;
}

export function GoalProgress({ current, goal, currency }: GoalProgressProps) {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  const remaining = Math.max(goal - current, 0);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Monthly Goal Progress
        </h3>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {Math.round(percentage)}%
        </span>
      </div>

      <ProgressBar
        value={current}
        max={goal}
        color={percentage >= 100 ? '#22c55e' : '#6366f1'}
      />

      <div className="flex justify-between mt-3 text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          {formatCurrency(current, currency)} earned
        </span>
        <span className="text-gray-600 dark:text-gray-400">
          {remaining > 0
            ? `${formatCurrency(remaining, currency)} to go`
            : 'Goal reached!'}
        </span>
      </div>

      {goal === 0 && (
        <p className="mt-3 text-sm text-amber-600 dark:text-amber-400">
          Set a monthly goal in Settings to track your progress
        </p>
      )}
    </Card>
  );
}
