import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/app';
import { Suspense } from 'react';
import ClientRoot from '@/components/client-root';
import { SessionProvider } from '@/components/session-provider';

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
          <SessionProvider>
            <AppProvider>
              <ClientRoot>{children}</ClientRoot>
            </AppProvider>
          </SessionProvider>
        </Suspense>
      </body>
    </html>
  );
}
