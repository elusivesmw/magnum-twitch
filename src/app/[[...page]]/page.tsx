'use client';

import Player from '@/components/player';
import MultiChat from '@/components/chat';
import { useContext, useEffect } from 'react';
import { PlayerView, getPlayerView } from '@/types/state';
import { AppContext } from '@/context/app';
import { useSearchParams, usePathname } from 'next/navigation';

export default function Home() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('This component requires AppProvider as a parent');
  }

  const {
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
    setUpdatePath,
  } = context;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const initialView = getViewFromSearchParams(searchParams);

  // initial view
  useEffect(() => {
    setPlayerView(initialView);
  }, [initialView, setPlayerView]);

  // NOTE: use pathname instead of page params, since this is client only.
  useEffect(() => {
    setUpdatePath(true);
    // get segements from path
    let segments = pathname.split('/').filter(Boolean);
    // de-dupe
    let initialWatching = Array.from(new Set(segments));
    // and set state
    setWatching(initialWatching);
    setOrder(initialWatching);
  }, [pathname, setWatching, setOrder, setUpdatePath]);

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

function getViewFromSearchParams(searchParams: URLSearchParams) {
  let view = getPlayerView(searchParams.get('v'));
  return view;
}
