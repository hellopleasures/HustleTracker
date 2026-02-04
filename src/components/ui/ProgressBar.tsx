import { cn } from '@/lib/utils/cn';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  color?: string;
}

export function ProgressBar({
  value,
  max = 100,
  className,
  showLabel = false,
  color,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            !color && 'bg-indigo-600 dark:bg-indigo-500'
          )}
          style={{
            width: `${percentage}%`,
            ...(color && { backgroundColor: color }),
          }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-sm text-gray-600 dark:text-gray-400">
          <span>{Math.round(percentage)}%</span>
          <span>
            {value.toLocaleString()} / {max.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}
