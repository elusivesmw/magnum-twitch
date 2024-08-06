'use client';

import Player from '@/components/player';
import MultiChat from '@/components/chat';
import { useContext, useEffect } from 'react';
import { PlayerView } from '@/types/state';
import { AppContext } from '@/context/app';

export default function Home({ params }: { params: { page: string[] } }) {
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
    playerView,
    setUpdatePath,
  } = context;

  useEffect(() => {
    setUpdatePath(true);
    if (!params.page) return;
    // de-dupe
    let initialWatching = Array.from(new Set(params.page));
    // and set
    setWatching(initialWatching);
    setOrder(initialWatching);
  }, [params.page, setWatching, setOrder, setUpdatePath]);

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

//
//function getViewFromSearchParams(searchParams: URLSearchParams) {
//  let view = getPlayerView(searchParams.get(SP_VIEW));
//  return view;
//}
