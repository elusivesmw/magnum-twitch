'use client';

import Player from '@/components/player';
import MultiChat from '@/components/chat';
import { useContext } from 'react';
import { PlayerView } from '@/types/state';
import { AppContext } from '@/context/app';
import { usePathSync } from '@/hooks/path-sync';
import { useToken } from '@/hooks/token';
import { useCleanupStreams } from '@/hooks/cleanup-streams';

export default function Home() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('This component requires AppProvider as a parent');
  }

  const {
    accessToken,
    setAccessToken,
    setUser,
    watching,
    setWatching,
    removeWatching,
    reorderWatching,
    order,
    setOrder,
    activeChat,
    setActiveChat,
    setPlayerView,
    playerView,
  } = context;

  useToken(accessToken, setAccessToken, setUser);
  usePathSync(setWatching, order, setOrder, playerView, setPlayerView);
  useCleanupStreams(accessToken, watching, removeWatching);

  return (
    <>
      <div
        id="player-container"
        className={`flex ${playerClass(
          playerView
        )} basis-auto grow shrink justify-around bg-black mt-[1px] mb-[2px]`}
      >
        {watching.map((e) => (
          <Player
            channel={e}
            order={order.findIndex((o) => o == e)}
            total={watching.length}
            isActiveChat={activeChat == e}
            reorderWatching={reorderWatching}
            removeWatching={removeWatching}
            key={`player-key-${e}`}
          />
        ))}
      </div>
      <MultiChat
        channels={order}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
      />
    </>
  );
}

function playerClass(view: PlayerView) {
  switch (view) {
    case PlayerView.Vertical:
      return 'flex-col flex-nowrap vertical';
    case PlayerView.Spotlight:
      return 'flex-row flex-wrap spotlight';
    case PlayerView.Grid:
    default:
      return 'flex-row flex-wrap';
  }
}
