import { getHustles } from '@/lib/actions/hustles';
import { HustleList } from '@/components/hustles/HustleList';

export default async function HustlesPage() {
  const hustles = await getHustles();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Hustles
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your income sources
        </p>
      </div>

      <HustleList hustles={hustles} />
    </div>
  );
}
