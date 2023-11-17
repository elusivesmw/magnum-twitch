'use client';

import Following from '@/components/following';
import Player from '@/components/player';
import MultiChat from '@/components/chat';
import { useState } from 'react';

export default function Home() {
  const [watching, setWatching] = useState([] as string[]);
  const [activeChat, setActiveChat] = useState(0);

  const addWatching = (channel: string) => {
    if (watching.includes(channel)) return;
    setWatching([...watching, channel]);
    setActiveChat(watching.length);
  };

  const removeWatching = (channel: string) => {
    let foundIndex = watching.findIndex((c) => c == channel);
    if (foundIndex < 0) return;
    setWatching(watching.filter((_, i) => i != foundIndex));
    // set active chat
    if (foundIndex > watching.length) foundIndex = watching.length;
    setActiveChat(foundIndex);
  };

  const reorderWatching = (channel: string) => {
    let foundIndex = watching.findIndex((c) => c == channel);
    if (foundIndex < 0) return;
    // move channel to index 0
    let newOrder = [...watching];
    move(newOrder, foundIndex, 0);
    setWatching(newOrder);
  };

  return (
    <main className="flex flex-col h-screen justify-between">
      <header className="flex h-20 grow-0 shrink-0 bg-chatpanel z-10 header-shadow">
        <span className="flex self-center p-4 text-xl font-bold">T</span>
        <span className="p-4">active chat: {activeChat}</span>
      </header>
      <div className="flex h-full">
        <Following addWatching={addWatching} />
        <div className="flex flex-col basis-auto grow shrink bg-noplayer">
          {watching.map((e, i) => (
            <Player
              channel={e}
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
    </main>
  );
}

function move(a: string[], from: number, to: number) {
  a.splice(to, 0, a.splice(from, 1)[0]);
}
