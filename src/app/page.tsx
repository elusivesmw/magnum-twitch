'use client';

import Following from '@/components/following';
import Player from '@/components/player';
import MultiChat from '@/components/chat';
import { useState } from 'react';

export default function Home() {
  const [watching, setWatching] = useState(['katun24']);
  const addWatching = (channel: string) => {
    if (watching.includes(channel)) return;
    setWatching([...watching, channel]);
  };
  const removeWatching = (channel: string) => {
    setWatching(watching.filter((e) => e !== channel));
  };

  return (
    <main className="flex max-h-screen justify-between">
      <Following addWatching={addWatching} />
      <div className="flex flex-col h-screen basis-auto grow shrink">
        {watching.map((e, i) => (
          <Player channel={e} removeWatching={removeWatching} key={i} />
        ))}
      </div>
      <MultiChat channels={watching} />
    </main>
  );
}
