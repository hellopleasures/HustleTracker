import Link from 'next/link';

export function QuickLogButton() {
  return (
    <Link
      href="/log"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-20"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
      <span className="sr-only">Log Income</span>
    </Link>
  );
}
