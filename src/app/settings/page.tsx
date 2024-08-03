'use client';

import { AppContext } from '@/context/context';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { FollowedGame } from '@/types/twitch';

export default function Settings() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('This component requires AppProvider as a parent');
  }

  const router = useRouter();
  let path = `/${context.order.join('/')}?v=${context.playerView}`;

  useEffect(() => {
    context.setUpdatePath(false);
  }, []);

  let temp: FollowedGame[] = [
    { game_id: 1229, game_title: 'Super Mario World' },
    { game_id: 505705, game_title: 'Noita' },
  ];

  return (
    <div className="sticky flex flex-col w-full">
      <div className="pt-12 px-12 ">
        <h2 className="text-[3.6rem] font-bold mb-4">Settings</h2>
        <div className="border-b border-twborder"></div>
      </div>
      <div className="px-12 overflow-y-scroll scrollbar">
        <div className="py-8 max-w-[900px]">
          <h3 className="text-xl font-semibold mb-8">Followed Games</h3>
          <div className="bg-chatpanel border border-twborder rounded-md p-8 mb-16 ">
            <ul>
              {temp.map((el) => {
                return <li>{el.game_title}</li>;
              })}
            </ul>
          </div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <div>placeholder</div>
          <button onClick={() => router.push(path)}>go back</button>
        </div>
      </div>
    </div>
  );
}
