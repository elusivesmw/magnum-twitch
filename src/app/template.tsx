'use client';

import Channels from '@/components/channels';
import Header from '@/components/header';
import { AppContext } from '@/context/context';
import { replaceSearchParams } from '@/lib/route';
import { PlayerView } from '@/types/state';
import { ReactNode, useContext } from 'react';

export default function Template({ children }: { children: ReactNode }) {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('This component requires AppProvider as a parent');
  }

  const {
    accessToken,
    user,
    watching,
    addWatching,
    removeWatching,
    order,
    playerView,
    setPlayerView,
  } = context;

  //
  function setSearchParamsFromView(view: PlayerView) {
    setPlayerView(view);
    replaceSearchParams(order, view);
  }

  return (
    <div id="root" className="flex flex-col h-screen">
      <Header
        accessToken={accessToken}
        user={user}
        addWatching={addWatching}
        playerView={playerView}
        setPlayerView={setSearchParamsFromView}
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
          />
        )}
        {children}
      </main>
    </div>
  );
}
