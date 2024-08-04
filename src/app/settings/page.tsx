'use client';

import { AppContext } from '@/context/context';
import { useContext, useEffect, useState } from 'react';
import { Category, FollowedGame } from '@/types/twitch';
import { TrashCan } from '@/components/icons';
import Link from 'next/link';
import { getHeaders } from '@/lib/auth';
import Image from 'next/image';

export default function Settings() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('This component requires AppProvider as a parent');
  }

  const { accessToken, setUpdatePath, followedGames, setFollowedGames } =
    context;

  const [query, setQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Category[]>([]);

  //const router = useRouter();
  let path = `/${context.order.join('/')}?v=${context.playerView}`;

  useEffect(() => {
    setUpdatePath(false);
  }, []);

  function searchClickHandler() {
    searchGames(accessToken, query);
  }

  function searchGames(accessToken: string | undefined, query: string) {
    if (!accessToken) return;
    if (query.length === 0) {
      setSearchResults([]);
      return;
    }

    const httpOptions = getHeaders(accessToken);
    fetch(
      `https://api.twitch.tv/helix/search/categories?query=${query}&first=10`,
      httpOptions
    )
      .then((res) => {
        if (!res.ok) return Promise.reject(res);
        return res.json();
      })
      .then((json) => {
        let games = json.data as Category[];
        setSearchResults(games);
      })
      .catch((err) => console.log(err));
  }

  // TODO: onclick followed game, switch channels view
  function followGame(game: Category) {
    console.log('follow game', game);
  }

  function unfollowGame(game: FollowedGame) {
    console.log('unfollow game', game);
  }

  return (
    <div className="flex flex-col w-full">
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
            <div className="my-4">
              <div className="my-4">
                <div className="text-sm font-bold mb-2">Search</div>
                <div className="flex">
                  <input
                    type="text"
                    className="w-full rounded-l-md"
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <button
                    onClick={searchClickHandler}
                    className="bg-twbuttonbg bg-opacity-[0.38] hover:bg-opacity-[0.48] p-2 rounded-r-md"
                  >
                    Search
                  </button>
                </div>
                <div className="text-xs text-fainttext mt-2">
                  Category to search
                </div>
              </div>

              {searchResults.length > 0 && (
                <div className="my-4">
                  {searchResults.length > 0 &&
                    searchResults
                      .filter(
                        (sr) =>
                          !followedGames.find(
                            (fg) => fg.game_id.toString() === sr.id
                          )
                      )
                      .map((el, i) => (
                        <div
                          key={i}
                          className="flex justify-start items-center bg-sidepanel faintpanel rounded-lg p-8 my-4"
                        >
                          <Image
                            src={el.box_art_url}
                            width={52}
                            height={72}
                            alt={`${el.name} box art`}
                          />
                          <div className="grow p-4">{el.name}</div>
                          <button
                            onClick={() => followGame(el)}
                            className="bg-twbuttonbg bg-opacity-[0.38] hover:bg-opacity-[0.48] px-4 py-2 rounded-md"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                </div>
              )}

              <div>
                <div className="text-sm font-bold mb-2">Followed Games</div>
                {followedGames.map((el, i) => {
                  return (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-sidepanel faintpanel rounded-lg p-8 my-4"
                    >
                      <div className="">{el.game_title}</div>
                      <button
                        className="p-2 rounded-md hover:bg-twborder"
                        onClick={() => unfollowGame(el)}
                      >
                        <TrashCan />
                      </button>
                    </div>
                  );
                })}
              </div>
              <Link href={path}>go back</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
