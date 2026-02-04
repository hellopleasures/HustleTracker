import { getIncomeEntries } from '@/lib/actions/income';
import { getHustles } from '@/lib/actions/hustles';
import { getProfile } from '@/lib/actions/profile';
import { HistoryList } from '@/components/history/HistoryList';
import { Filters } from '@/components/history/Filters';

interface HistoryPageProps {
  searchParams: Promise<{
    hustle?: string;
    month?: string;
  }>;
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const params = await searchParams;
  const [entries, hustles, profile] = await Promise.all([
    getIncomeEntries({
      hustleId: params.hustle,
      month: params.month,
    }),
    getHustles(),
    getProfile(),
  ]);

  const currency = profile?.currency || 'USD';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Income History
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage your income entries
        </p>
      </div>

      <Filters hustles={hustles} />

      <HistoryList entries={entries} hustles={hustles} currency={currency} />
    </div>
  );
}
