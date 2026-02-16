'use client';

import Player from '@/components/player';
import MultiChat from '@/components/chat';
import { PlayerView } from '@/types/state';
import { usePathSync } from '@/hooks/path-sync';
import { useCleanupStreams } from '@/hooks/cleanup-streams';
import { useRequiredContext } from '@/hooks/required-context';

export default function Home() {
  const context = useRequiredContext();

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
  } = context;

  usePathSync(setWatching, order, setOrder, playerView, setPlayerView);
  useCleanupStreams(watching, removeWatching);

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
