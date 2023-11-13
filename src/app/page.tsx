'use client';

import Following from '@/components/following';
import Player from '@/components/player';
import MultiChat from '@/components/chat';
import { use, useState } from 'react';

export default function Home() {
  const [watching, setWatching] = useState(['katun24']);
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
    <main className="flex max-h-screen justify-between">
      <span className="p-3">{activeChat}</span>
      <Following addWatching={addWatching} />
      <div className="flex flex-col h-screen basis-auto grow shrink">
        {watching.map((e, i) => (
          <Player channel={e} removeWatching={removeWatching} key={i} />
        ))}
      </div>
      <MultiChat
        channels={watching}
        activeChat={activeChat}
        updateActiveChat={setActiveChat}
      />
    </main>
  );
}
