'use client';

import Following from '@/components/following';
import Player from '@/components/player';
import MultiChat from '@/components/chat';
import { useState } from 'react';

export default function Home() {
  const [watching, setWatching] = useState([] as string[]);
  const [activeChat, setActiveChat] = useState(0);
  const [order, setOrder] = useState([] as string[]);

  const addWatching = (channel: string) => {
    if (watching.includes(channel)) return;
    setWatching([...watching, channel]);
    setOrder([...order, channel]);
    //setActiveChat(watching.length);
  };

  const removeWatching = (channel: string) => {
    let watchingIndex = watching.findIndex((c) => c == channel);
    if (watchingIndex < 0) return;
    setWatching(watching.filter((_, i) => i != watchingIndex));
    // set active chat
    if (watchingIndex > watching.length) watchingIndex = watching.length;
    setActiveChat(watchingIndex);
    setOrder(order.filter((o) => o != channel));
  };

  const reorderWatching = (channel: string, rel: number) => {
    let fromOrder = order.findIndex((o) => o == channel);
    let toOrder = fromOrder + rel;
    if (toOrder < 0 || toOrder > watching.length + 1) return;
    // move channel to index 0
    let newOrder = [...order];
    move(newOrder, fromOrder, toOrder);
    setOrder(newOrder);
  };

  return (
    <main className="flex flex-col h-screen">
      <header className="flex h-20 grow-0 shrink-0 bg-chatpanel z-10 header-shadow">
        <span className="flex self-center p-4 text-xl font-bold">T</span>
        <span className="p-4">active chat: {activeChat}</span>
      </header>
      <div className="relative h-full">
        <div className="absolute w-full h-full">
          <div className="flex h-full">
            <Following addWatching={addWatching} />
            <div className="flex flex-col basis-auto grow shrink bg-noplayer">
              {watching.map((e, i) => (
                <Player
                  channel={e}
                  order={order.findIndex((o) => o == e)}
                  reorderWatching={reorderWatching}
                  removeWatching={removeWatching}
                  key={i}
                />
              ))}
            </div>
            <MultiChat
              channels={watching}
              activeChat={activeChat}
              updateActiveChat={setActiveChat}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function move(order: string[], from: number, to: number) {
  order.splice(to, 0, order.splice(from, 1)[0]);
}
