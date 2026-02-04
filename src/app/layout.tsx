import type { Metadata } from 'next';
import { ThemeProvider } from '@/contexts/theme-context';
import { ToastProvider } from '@/components/ui/Toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'HustleTracker - Track Your Side Hustle Income',
  description:
    'Track income across multiple side hustles, set monthly goals, and visualize your earnings with HustleTracker.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-900 min-h-screen antialiased">
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
