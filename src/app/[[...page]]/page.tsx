'use client';

import Player from '@/components/player';
import MultiChat from '@/components/chat';
import { use, useContext, useEffect } from 'react';
import { PlayerView, getPlayerView } from '@/types/state';
import { AppContext } from '@/context/app';
import { useSearchParams } from 'next/navigation';

type Params = Promise<{ page: string[] }>;

export default function Home(props: { params: Params }) {
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

  const params = use(props.params);

  const searchParams = useSearchParams();
  const initialView = getViewFromSearchParams(searchParams);

  // initial view
  useEffect(() => {
    setPlayerView(initialView);
  }, [initialView, setPlayerView]);

  // watching change
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

function getViewFromSearchParams(searchParams: URLSearchParams) {
  let view = getPlayerView(searchParams.get('v'));
  return view;
}
