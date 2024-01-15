import { Carousel, Grid, Plus, Twitch } from '@/components/icons';
import { PlayerLayout } from '@/types/state';
import { User } from '@/types/twitch';
import Image from 'next/image';
import { FormEvent } from 'react';

const TWITCH_CLIENT_ID = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Header({
  accessToken,
  user,
  addWatching,
  playerLayout,
  setPlayerLayout,
}: {
  accessToken: string | undefined;
  user: User | undefined;
  addWatching: (channel: string) => void;
  playerLayout: PlayerLayout;
  setPlayerLayout: (layout: PlayerLayout) => void;
}) {
  const addAnyChannel = (e: FormEvent) => {
    e.preventDefault();
    const textbox = document.getElementById(
      'header-search'
    ) as HTMLInputElement;
    let channel = textbox.value;
    textbox.value = '';
    if (channel.length <= 0) return;
    addWatching(channel);
  };

  return (
    <header className="flex h-20 grow-0 shrink-0 bg-chatpanel z-20 header-shadow justify-between">
      <div className="flex">
        <div className="p-2">
          <a href="/">
            {/* temporarily use this logo to reset all players */}
            <Twitch />
          </a>
        </div>
        <div className="flex h-full py-4 px-2">
          <button
            onClick={() => setPlayerLayout(PlayerLayout.Grid)}
            className="flex items-center bg-twbuttonbg bg-opacity-[0.38] hover:bg-opacity-[0.48] active:bg-opacity-[0.55] rounded-l-[6px]"
          >
            <div
              className={`px-4 ${
                playerLayout == PlayerLayout.Grid ? 'text-twpurple' : ''
              }`}
            >
              <Grid />
            </div>
          </button>
          <button
            onClick={() => setPlayerLayout(PlayerLayout.Spotlight)}
            className="flex items-center bg-twbuttonbg bg-opacity-[0.38] hover:bg-opacity-[0.48] active:bg-opacity-[0.55] rounded-r-[6px]"
          >
            <div
              className={`px-4 border-l border-twbuttonbg/[0.48] ${
                playerLayout == PlayerLayout.Spotlight ? 'text-twpurple' : ''
              }`}
            >
              <Carousel />
            </div>
          </button>
        </div>
      </div>
      <div className="flex w-[40rem] h-[3.6rem] self-center">
        <form onSubmit={addAnyChannel} className="flex w-full h-full">
          <input
            type="text"
            id="header-search"
            className="w-full h-full rounded-tl-[6px] rounded-bl-[6px]"
          />
          <button
            type="submit"
            className="h-full px-2 bg-twbuttonbg bg-opacity-[0.38] hover:bg-opacity-[0.48] active:bg-opacity-[0.55] rounded-tr-[6px] rounded-br-[6px]"
          >
            <div className="h-[30px]">
              <Plus />
            </div>
          </button>
        </form>
      </div>
      <div className="flex p-4">
        {user && (
          <div className="w-[30px]">
            <Image
              src={user.profile_image_url}
              alt={`${user.login} profile`}
              className="w-full max-w-full rounded-full object-cover"
              width={30}
              height={30}
            />
          </div>
        )}
        {!accessToken && (
          <a
            href={`https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${TWITCH_CLIENT_ID}&redirect_uri=${BASE_URL}&scope=user:read:follows`}
            className="inline-flex items-center text-sm font-semibold px-4 text-twbuttontext bg-twbuttonbg bg-opacity-[0.38] hover:bg-opacity-[0.48] rounded-[4px]"
          >
            Log In
          </a>
        )}
      </div>
    </header>
  );
}
