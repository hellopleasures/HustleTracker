import { getHustlesWithStats } from '@/lib/actions/hustles';
import { getProfile } from '@/lib/actions/profile';
import { HustleListWithStats } from '@/components/hustles/HustleListWithStats';
import { HustleBarChart } from '@/components/hustles/HustleBarChart';

export default async function HustlesPage() {
  const [hustles, profile] = await Promise.all([
    getHustlesWithStats(),
    getProfile(),
  ]);

  const currency = profile?.currency || 'USD';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Hustles
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your income sources and track earnings
        </p>
      </div>

      {hustles.length > 0 && (
        <HustleBarChart hustles={hustles} currency={currency} />
      )}

      <HustleListWithStats hustles={hustles} currency={currency} />
    </div>
  );
}
