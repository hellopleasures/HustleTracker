import { getHustles } from '@/lib/actions/hustles';
import { IncomeForm } from '@/components/income/IncomeForm';

export default async function LogPage() {
  const hustles = await getHustles();

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Log Income
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Record your earnings from a side hustle
        </p>
      </div>

      <IncomeForm hustles={hustles} />
    </div>
  );
}
