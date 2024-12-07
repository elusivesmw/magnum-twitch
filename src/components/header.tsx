import { Carousel, Grid, Plus, Twitch } from '@/components/icons';
import { PlayerView } from '@/types/state';
import { User } from '@/types/twitch';
import Link from 'next/link';
import { FormEvent } from 'react';
import UserMenu from './user-menu';
import { LOGIN_LINK } from '@/lib/auth';

export default function Header({
  accessToken,
  clearAccessToken,
  user,
  addWatching,
  playerView,
  setPlayerView,
}: {
  accessToken: string | undefined;
  clearAccessToken: () => void;
  user: User | undefined;
  addWatching: (channel: string) => void;
  playerView: PlayerView;
  setPlayerView: (view: PlayerView) => void;
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
          <Link href="/">
            {/* temporarily use this logo to reset all players */}
            <Twitch className="h-16" />
          </Link>
        </div>
        <div className="flex h-full py-4 px-2">
          <button
            onClick={() => setPlayerView(PlayerView.Grid)}
            className="flex items-center bg-twbuttonbg bg-opacity-[0.38] hover:bg-opacity-[0.48] active:bg-opacity-[0.55] rounded-l-[6px]"
          >
            <div
              className={`px-4 ${
                playerView == PlayerView.Grid ? 'text-twpurple' : ''
              }`}
            >
              <Grid className="h-8" />
            </div>
          </button>
          <button
            onClick={() => setPlayerView(PlayerView.Spotlight)}
            className="flex items-center bg-twbuttonbg bg-opacity-[0.38] hover:bg-opacity-[0.48] active:bg-opacity-[0.55] rounded-r-[6px]"
          >
            <div
              className={`px-4 border-l border-twbuttonbg/[0.48] ${
                playerView == PlayerView.Spotlight ? 'text-twpurple' : ''
              }`}
            >
              <Carousel className="h-8" />
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
      <div className="relative flex p-4">
        {accessToken && (
          <UserMenu user={user} clearAccessToken={clearAccessToken} />
        )}
        {!accessToken && (
          <a
            href={LOGIN_LINK}
            className="inline-flex items-center text-sm font-semibold px-4 text-twbuttontext bg-twbuttonbg bg-opacity-[0.38] hover:bg-opacity-[0.48] rounded-[4px]"
          >
            Log In
          </a>
        )}
      </div>
    </header>
  );
}
