'use client';

import { AppContext } from '@/context/context';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { FollowedGame } from '@/types/twitch';
import { TrashCan } from '@/components/icons';

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

  function unfollowGame(game: FollowedGame) {
    console.log('unfollow game', game);
  }

  return (
    <div className="sticky flex flex-col w-full">
      <div className="pt-12 px-12 ">
        <h2 className="text-[3.6rem] font-bold mb-4">Settings</h2>
        <div className="border-b border-twborder"></div>
      </div>
      <div className="px-12 overflow-y-scroll scrollbar">
        <div className="py-8 max-w-[900px]">
          <div className="mb-8">
            <h3 className="text-xl font-semibold">Followed Games</h3>
            <p className="text-sm text-fainttext mt-4">
              Getting a list of followed games is not supported by the Twitch
              API.
            </p>
            <p className="text-sm text-fainttext">
              Add games here to view live channels in the sidebar. Click
              "Followed Channels" to select between followed channels and
              followed games.
            </p>
          </div>
          <div className="bg-chatpanel border border-twborder rounded-md px-8 py-4 mb-16">
            <ul>
              {temp.map((el) => {
                return (
                  <li className="flex justify-between bg-sidepanel faintpanel rounded-lg p-8 my-4">
                    <div className="">{el.game_title}</div>
                    <button
                      className="p-2 rounded-md hover:bg-twborder"
                      onClick={() => unfollowGame(el)}
                    >
                      <TrashCan />
                    </button>
                  </li>
                );
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
          <button onClick={() => router.push(path)}>go back</button>
        </div>
      </div>
    </div>
  );
}
