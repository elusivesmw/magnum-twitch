'use client';

import Following from '@/components/following';
import Player from '@/components/player';
import MultiChat from '@/components/chat';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { User } from '@/types/twitch';
import { getHeaders, getOAuthHeaders } from '@/lib/auth';
import { replacePath } from '@/lib/route';
import { PlayerLayout } from '@/types/state';
import Header from '@/components/header';
import { FollowingPopup } from '@/components/popups';

const TWITCH_CLIENT_ID = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const LS_ACCESS_TOKEN = 'ACCESS_TOKEN';
const VALIDATE_INTERVAL = 60 * 60 * 1000;

export default function Home({ params }: { params: { page: string[] } }) {
  const searchParams = useSearchParams();
  const [watching, setWatching] = useState<string[]>([]);
  const [activeChat, setActiveChat] = useState(0);
  const [order, setOrder] = useState<string[]>([]);
  const [playerLayout, setPlayerLayout] = useState<PlayerLayout>(
    PlayerLayout.Grid
  );

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
  }, [params.page]);

  const [accessToken, setAccessToken] = useState<string | undefined>();
  useEffect(() => {
    if (getError(searchParams)) {
      // remove query params
      replacePath(order);
    }
    let token = getToken();
    if (!token) return;

    setAccessToken(token);
  }, [order, searchParams]);

  const [user, setUser] = useState<User | undefined>();
  useEffect(() => {
    updateUser(accessToken);
  }, [accessToken]);

  useEffect(() => {
    validateToken(accessToken);
    const intervalId = setInterval(() => {
      validateToken(accessToken);
    }, VALIDATE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [accessToken]);

  const validateToken = (accessToken: string | undefined) => {
    if (!accessToken) return;
    const httpOptions = getOAuthHeaders(accessToken);
    fetch('https://id.twitch.tv/oauth2/validate', httpOptions)
      .then((res) => {
        if (!res.ok) {
          // token no good, clear
          setAccessToken(undefined);
          return Promise.reject(res);
        }
        console.log('Valid token');
      })
      .catch((err) => console.log(err));
  };

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

  const updateUser = (accessToken: string | undefined) => {
    if (!accessToken) return;
    const httpOptions = getHeaders(accessToken);
    fetch('https://api.twitch.tv/helix/users', httpOptions)
      .then((res) => {
        if (!res.ok) return Promise.reject(res);
        return res.json();
      })
      .then((json) => {
        let users = json.data as User[];
        if (users.length != 1) return;
        setUser(users[0]);
      })
      .catch((err) => console.log(err));
  };

  return (
    <main className="flex flex-col h-screen">
      <Header
        accessToken={accessToken}
        user={user}
        addWatching={addWatching}
        playerLayout={playerLayout}
        setPlayerLayout={setPlayerLayout}
      />
      <div className="relative h-full">
        <div className="absolute w-full h-full">
          <div className="flex h-full">
            {user && (
              <Following
                accessToken={accessToken}
                user={user}
                watching={watching}
                addWatching={addWatching}
              />
            )}
            <div
              id="player-container"
              className={`flex ${playerClass(
                playerLayout
              )} basis-auto grow shrink justify-around bg-black mt-[1px] mb-[2px]`}
            >
              {watching.map((e) => (
                <Player
                  channel={e}
                  order={order.findIndex((o) => o == e)}
                  total={watching.length}
                  isActiveChat={watching[activeChat] == e}
                  reorderWatching={reorderWatching}
                  removeWatching={removeWatching}
                  key={`player-key-${e}`}
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

function getToken(): string | null {
  // get from hash
  let hash = getHashValues();
  let token = hash?.access_token;
  if (token) {
    // save token
    localStorage.setItem(LS_ACCESS_TOKEN, token);
    return token;
  }

  // else try get from storage
  token = localStorage.getItem(LS_ACCESS_TOKEN);
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
      return 'flex-col flex-nowrap vertical';
    case PlayerLayout.Spotlight:
      return 'flex-row flex-wrap spotlight';
    case PlayerLayout.Grid:
    default:
      return 'flex-row flex-wrap';
  }
}
