'use client';

import Channels from '@/components/channels';
import Header from '@/components/header';
import { AppContext } from '@/context/app';
import { ReactNode, useContext } from 'react';

export default function ClientRoot({ children }: { children: ReactNode }) {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('This component requires AppProvider as a parent');
  }

  const {
    accessToken,
    setAccessToken,
    user,
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
        accessToken={accessToken}
        setAccessToken={setAccessToken}
        user={user}
        addWatching={addWatching}
        playerView={playerView}
        setPlayerView={setPlayerView}
      />
      <main className="relative flex h-full overflow-y-hidden">
        {user && (
          <Channels
            accessToken={accessToken}
            user={user}
            watching={watching}
            addWatching={addWatching}
            removeWatching={removeWatching}
            view={playerView}
            followedCategories={followedCategories}
          />
        )}
        {children}
      </main>
    </div>
  );
}
