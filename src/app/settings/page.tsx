'use client';

import { AppContext } from '@/context/context';
import { ReactNode, useContext, useEffect, useState } from 'react';
import { Category } from '@/types/twitch';
import { Plus, TrashCan } from '@/components/icons';
import Link from 'next/link';
import { getHeaders } from '@/lib/auth';
import Image from 'next/image';

enum Action {
  Add,
  Remove,
}

export default function Settings() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('This component requires AppProvider as a parent');
  }

  const {
    accessToken,
    setUpdatePath,
    followedCategories,
    saveFollowedCategories,
  } = context;

  const [query, setQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Category[]>([]);

  //const router = useRouter();
  let path = `/${context.order.join('/')}?v=${context.playerView}`;

  useEffect(() => {
    setUpdatePath(false);
  }, [setUpdatePath]);

  function searchGames() {
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
  function followGame(cat: Category) {
    saveFollowedCategories([...followedCategories, cat]);
  }

  function unfollowGame(cat: Category) {
    console.log('unfollow cat', cat);
    let newFollowedCategories = followedCategories.filter(
      (fc) => fc.id !== cat.id
    );
    saveFollowedCategories(newFollowedCategories);
  }

  function CategoryRow({ cat, action }: { cat: Category; action: Action }) {
    let button;
    if (action === Action.Add) {
      button = (
        <button
          onClick={() => followGame(cat)}
          className="p-2 rounded-md hover:bg-twborder"
        >
          <Plus className="h-8" />
        </button>
      );
    } else {
      button = (
        <button
          className="p-2 rounded-md hover:bg-twborder"
          onClick={() => unfollowGame(cat)}
        >
          <TrashCan />
        </button>
      );
    }

    return (
      <div className="flex justify-start items-center bg-sidepanel faintpanel rounded-lg p-8 my-4">
        <Image
          src={cat.box_art_url}
          width={52}
          height={72}
          alt={`${cat.name} box art`}
        />
        <div className="grow p-4">{cat.name}</div>
        {button}
      </div>
    );
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
              &quot;Followed Channels&quot; to select between followed channels
              and followed categories.
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
                    onClick={() => searchGames()}
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
                          !followedCategories.find((fc) => fc.id === sr.id)
                      )
                      .map((el, i) => (
                        <CategoryRow
                          key={i}
                          cat={el}
                          action={Action.Add}
                        ></CategoryRow>
                      ))}
                </div>
              )}

              <div className="my-4">
                <div className="text-sm font-bold mb-2">
                  Followed Categories
                </div>
                {followedCategories.map((el, i) => {
                  return (
                    <CategoryRow
                      key={i}
                      cat={el}
                      action={Action.Remove}
                    ></CategoryRow>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="">
            <Link
              href={path}
              className="bg-twpurple font-bold px-4 py-2 rounded-md"
            >
              Back to Watching
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
