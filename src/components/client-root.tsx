'use client';

import Channels from '@/components/channels';
import Header from '@/components/header';
import { useRequiredContext } from '@/hooks/required-context';
import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';

export default function ClientRoot({ children }: { children: ReactNode }) {
  const context = useRequiredContext();
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
