'use client';

import Following from '@/components/following';
import Player from '@/components/player';
import MultiChat from '@/components/chat';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { User } from '@/types/twitch';
import { Plus } from '@/components/icons';
import { getHeaders, getOAuthHeaders } from '@/lib/auth';
import { PlayerLayout } from '@/types/state';
import { replacePath } from '@/lib/route';

const TWITCH_CLIENT_ID = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const LS_ACCESS_TOKEN = 'ACCESS_TOKEN';
const VALIDATE_INTERVAL = 60 * 60 * 1000;

export default function Home({ params }: { params: { page: string[] } }) {
  const searchParams = useSearchParams();
  const [watching, setWatching] = useState<string[]>([]);
  const [activeChat, setActiveChat] = useState(0);
  const [order, setOrder] = useState<string[]>([]);
  const [playerLayout, setPlayerLayout] = useState<PlayerLayout>(PlayerLayout.Grid);

  useEffect(() => {
    // initial page load, open channels
    const serverPath = params.page;
    // make sure no duplicates
    const uniqueWatching = Array.from(new Set(serverPath));

    if (uniqueWatching.length == 0) return;
    setWatching(uniqueWatching);
    setOrder(uniqueWatching);

    // update client path
    replacePath(uniqueWatching);
  }, []);

  const [accessToken, setAccessToken] = useState<string | undefined>();
  useEffect(() => {
    if (getError(searchParams)) {
      // remove query params
      replacePath(order);
    }
    let token = getToken();
    if (!token) return;

    setAccessToken(token);
  }, []);

  const [user, setUser] = useState<User | undefined>();
  useEffect(() => {
    updateUser();
  }, [accessToken]);

  useEffect(() => {
    validateToken();
    const intervalId = setInterval(() => {
      validateToken();
    }, VALIDATE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [accessToken]);

  const validateToken = () => {
    if (!accessToken) return;
    const httpOptions = getOAuthHeaders(accessToken);
    fetch('https://id.twitch.tv/oauth2/validate', httpOptions)
      .then((res) => {
        if (!res.ok) {
          // token no good, clear
          setAccessToken(undefined);
          throw new Error(`Validate responded with ${res.status}`);
        }
        console.log('valid token');
      }).catch((err) => console.log(err));
  }

  const addWatching = (channel: string) => {
    if (watching.includes(channel)) {
      // add highlight animation
      let channelDiv = document.getElementById(`twitch-embed-${channel}`);
      if (!channelDiv) return;
      channelDiv.classList.add('animate-highlight');
      return;
    }

    if (watching.length >= 9) {
      // do this better :]
      alert("That's enough, dude.");
      return;
    }

    setWatching([...watching, channel]);
    let newOrder = [...order, channel];
    setOrder(newOrder);

    // update client path
    replacePath(newOrder);

    if (watching.length < 1) {
      setActiveChat(0);
    }
  };

  const removeWatching = (channel: string) => {
    let watchingIndex = watching.findIndex((c) => c == channel);
    if (watchingIndex < 0) return;
    // remove player
    setWatching(watching.filter((_, i) => i != watchingIndex));
    // update order
    let newOrder = order.filter((o) => o != channel);
    setOrder(newOrder);

    // update client path
    replacePath(newOrder);

    // set active chat
    if (watchingIndex >= watching.length - 1) {
      watchingIndex--;
    }
    setActiveChat(watchingIndex);
  };

  const addAnyChannel = () => {
    const e = document.getElementById('header-search') as HTMLInputElement;
    let channel = e.value;
    e.value = '';
    if (channel.length <= 0) return;
    addWatching(channel);
  };

  const reorderWatching = (
    channel: string,
    index: number,
    relative: boolean
  ) => {
    let fromOrder = order.findIndex((o) => o == channel);
    let toOrder = relative ? fromOrder + index : index;
    if (toOrder < 0 || toOrder > watching.length + 1) return;

    // set active chat on goto first
    if (!relative && toOrder == 0) {
      let chatIndex = watching.findIndex((o) => o == channel);
      setActiveChat(chatIndex);
    }

    // move channel to index 0
    let newOrder = [...order];
    move(newOrder, fromOrder, toOrder);
    setOrder(newOrder);

    // update client path
    replacePath(newOrder);
  };

  const toggleVertical = () => {
    let next = playerLayout + 1;
    if (next > 2) next = 0;
    setPlayerLayout(next);
  }

  const updateUser = () => {
    if (!accessToken) return;
    const httpOptions = getHeaders(accessToken);
    fetch('https://api.twitch.tv/helix/users', httpOptions)
      .then((res) => res.json())
      .then((json) => {
        let users = json.data as User[];
        if (users.length != 1) return;
        setUser(users[0]);
      }).catch((err) => console.log(err));
  };

  return (
    <main className="flex flex-col h-screen">
      <header className="flex h-20 grow-0 shrink-0 bg-chatpanel z-20 header-shadow justify-between">
        <div className="flex p-4">
          <span className="flex self-center p-4 text-xl font-bold">T</span>
          <button
            onClick={toggleVertical}
            className="h-full px-2 bg-twbuttonbg bg-opacity-[0.38] hover:bg-opacity-[0.48] active:bg-opacity-[0.55] rounded-[6px]"
          >
            <div className="flex h-[30px] w-[60px] justify-center items-center">
              {playerLayout.toString()}
            </div>
          </button>

        </div>
        <div className="flex w-[40rem] h-[3.6rem] self-center">
          <input
            type="text"
            id="header-search"
            className="w-full h-full rounded-tl-[6px] rounded-bl-[6px]"
          />
          <button
            onClick={addAnyChannel}
            className="h-full px-2 bg-twbuttonbg bg-opacity-[0.38] hover:bg-opacity-[0.48] active:bg-opacity-[0.55] rounded-tr-[6px] rounded-br-[6px]"
          >
            <div className="h-[30px]">
              <Plus />
            </div>
          </button>
        </div>
        <div className="flex p-4">
          {user && (
            <div className="w-[30px]">
              <img
                src={user.profile_image_url}
                className="w-full max-w-full rounded-full object-cover"
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
      <div className="relative h-full">
        <div className="absolute w-full h-full">
          <div className="flex h-full">
            {user &&
              <Following accessToken={accessToken} user={user} watching={watching} addWatching={addWatching} />
            }
            <div className={`flex ${playerClass(playerLayout)} basis-auto grow shrink justify-around bg-black mt-[1px] mb-[2px]`}>
              {watching.map((e) => (
                <Player
                  channel={e}
                  order={order.findIndex((o) => o == e)}
                  total={watching.length}
                  reorderWatching={reorderWatching}
                  removeWatching={removeWatching}
                  key={`$player-key-${e}`}
                />
              ))}
            </div>
            <MultiChat
              channels={watching}
              activeChat={activeChat}
              updateActiveChat={setActiveChat}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function move(order: string[], from: number, to: number) {
  order.splice(to, 0, order.splice(from, 1)[0]);
}

function getToken() {
  // try get from storage
  let token = localStorage.getItem(LS_ACCESS_TOKEN);
  if (token) return token;

  // else get from hash
  let hash = getHashValues();
  token = hash?.access_token;
  if (!token) return;

  // save token
  // TODO: handle expiry
  localStorage.setItem(LS_ACCESS_TOKEN, token);

  return token;
}

function getHashValues() {
  let hash = document.location.hash.substring(1);
  if (!hash) return undefined;
  var params: any = {};
  hash.split('&').map((hashkey) => {
    let temp = hashkey.split('=');
    params[temp[0]] = temp[1];
  });
  console.log(params);
  return params;
}

function getError(searchParams: URLSearchParams) {
  if (!searchParams) return false;
  //const error = searchParams.get('error');
  const description = searchParams.get('error_description');
  //const state = searchParams.get('state');
  if (!description) return false;

  alert(description);
  return true;
}

function playerClass(layout: PlayerLayout) {
  switch (layout) {
    case PlayerLayout.Vertical:
      return "flex-col flex-nowrap vertical";
    case PlayerLayout.Spotlight:
      return "flex-row flex-wrap spotlight";
    case PlayerLayout.Grid:
    default:
      return "flex-row flex-wrap";
  }
}

