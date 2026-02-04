import { getDashboardStats } from '@/lib/actions/income';
import { getProfile } from '@/lib/actions/profile';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { GoalProgress } from '@/components/dashboard/GoalProgress';
import { TopHustlesChart } from '@/components/dashboard/TopHustlesChart';
import { RecentEntries } from '@/components/dashboard/RecentEntries';
import { QuickLogButton } from '@/components/dashboard/QuickLogButton';
import { format } from 'date-fns';

export default async function DashboardPage() {
  const [stats, profile] = await Promise.all([getDashboardStats(), getProfile()]);

  const currency = profile?.currency || 'USD';
  const currentMonth = format(new Date(), 'MMMM yyyy');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{currentMonth}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SummaryCard
          title="This Month's Income"
          amount={stats.monthlyTotal}
          currency={currency}
          subtitle={`From ${stats.topHustles.length} hustle${
            stats.topHustles.length !== 1 ? 's' : ''
          }`}
        />
        <GoalProgress
          current={stats.monthlyTotal}
          goal={stats.monthlyGoal}
          currency={currency}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TopHustlesChart hustles={stats.topHustles} currency={currency} />
        <RecentEntries entries={stats.recentEntries} currency={currency} />
      </div>

      <QuickLogButton />
    </div>
  );
}
