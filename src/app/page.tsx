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
    var fi = watching.findIndex((e) => e == channel);
    if (fi < 0) return;
    setWatching(watching.filter((_, i) => i != fi));
    // set active chat
    if (fi > watching.length) fi = watching.length;
    setActiveChat(fi);
  };

  return (
    <main className="flex flex-col h-screen justify-between">
      <header className="flex h-20 grow-0 shrink-0 bg-chatpanel z-10 header-shadow">
        <div className="flex self-center p-4 text-xl font-bold">T</div>
      </header>
      <div className="flex h-full">
        <span className="p-3">{activeChat}</span>
        <Following addWatching={addWatching} />
        <div className="flex flex-col basis-auto grow shrink bg-noplayer">
          {watching.map((e, i) => (
            <Player channel={e} removeWatching={removeWatching} key={i} />
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
