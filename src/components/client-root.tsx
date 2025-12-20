'use client';

import Channels from '@/components/channels';
import Header from '@/components/header';
import { AppContext } from '@/context/app';
import { useSession } from 'next-auth/react';
import { ReactNode, useContext } from 'react';

export default function ClientRoot({ children }: { children: ReactNode }) {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('This component requires AppProvider as a parent');
  }

  const { data: session } = useSession();

  const {
    watching,
    addWatching,
    removeWatching,
    playerView,
    setPlayerView,
    followedCategories,
  } = context;

  return (
    <div id="root" className="flex flex-col h-screen">
      <Header
        addWatching={addWatching}
        playerView={playerView}
        setPlayerView={setPlayerView}
      />
      <main className="relative flex h-full overflow-y-hidden">
        {session && (
          <Channels
            watching={watching}
            addWatching={addWatching}
            removeWatching={removeWatching}
            followedCategories={followedCategories}
          />
        )}
        {children}
      </main>
    </div>
  );
}
