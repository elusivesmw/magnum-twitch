import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/context';
import { Suspense } from 'react';
import ClientRoot from '@/components/client-root';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Magnum Twitch',
  description: 'Twitch client alternative',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense>
          <AppProvider>
            <ClientRoot>{children}</ClientRoot>
          </AppProvider>
        </Suspense>
      </body>
    </html>
  );
}
