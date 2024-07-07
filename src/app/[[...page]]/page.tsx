'use client';

import Player from '@/components/player';
import MultiChat from '@/components/chat';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Stream, User } from '@/types/twitch';
import { getHeaders, getOAuthHeaders } from '@/lib/auth';
import { removeSearchParams, replaceSearchParams } from '@/lib/route';
import { PlayerLayout, getPlayerLayout } from '@/types/state';
import Header from '@/components/header';
import Channels from '@/components/channels';

const TWITCH_CLIENT_ID = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const LS_ACCESS_TOKEN = 'ACCESS_TOKEN';
const SP_LAYOUT = 'layout';
const VALIDATE_INTERVAL = 60 * 60 * 1000;
const LIVE_CHECK_INTERVAL = 60 * 1000;

export default function Home({ params }: { params: { page: string[] } }) {
  // global helpers
  const searchParams = useSearchParams();

  // initial page load, open channels
  const serverPath = params.page;
  // make sure no duplicates
  const uniqueWatching = Array.from(new Set(serverPath));
  // set first chat
  const initialChat = uniqueWatching.length > 0 ? uniqueWatching[0] : '';

  // state
  const [accessToken, setAccessToken] = useState<string | undefined>();
  const [user, setUser] = useState<User | undefined>();
  const [watching, setWatching] = useState<string[]>(uniqueWatching);
  const [order, setOrder] = useState<string[]>(uniqueWatching);
  const [activeChat, setActiveChat] = useState(initialChat);
  const [playerLayout, setPlayerLayout] = useState<PlayerLayout>(
    getLayoutFromSearchParams(searchParams)
  );

  // set token
  useEffect(() => {
    if (getError(searchParams)) {
      // remove query params
      removeSearchParams(order);
    }
    let token = getToken();
    if (!token) return;

    setAccessToken(token);
  }, [order, searchParams]);

  // set user
  useEffect(() => {
    updateUser(accessToken);
  }, [accessToken]);

  // validate token every hour
  useEffect(() => {
    validateToken(accessToken);
    const intervalId = setInterval(() => {
      validateToken(accessToken);
    }, VALIDATE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [accessToken]);

  //
  const removeWatching = useCallback(
    (channel: string) => {
      if (!watching.find((e) => e == channel)) return;

      // remove player
      setWatching((w) => w.filter((e) => e != channel));
      setOrder((o) => o.filter((e) => e != channel));
    },
    [watching]
  );

  //
  const reconcileStreams = useCallback(
    (stillLive: string[]) => {
      // remove from watching
      for (let i = 0; i < watching.length; ++i) {
        let w = watching[i];
        if (!stillLive.find((e) => e == w)) {
          removeWatching(w);
        }
      }
    },
    [removeWatching, watching]
  );

  //
  const liveCheckStreams = useCallback(
    (accessToken: string | undefined) => {
      if (!accessToken) return;
      if (watching.length == 0) return;

      const httpOptions = getHeaders(accessToken);
      let logins_param = 'user_login=' + watching.join('&user_login=');
      fetch(`https://api.twitch.tv/helix/streams?${logins_param}`, httpOptions)
        .then((res) => res.json())
        .then((json) => {
          let streams = json.data as Stream[];
          let s = streams.map((e) => e.user_login);
          reconcileStreams(s);
        })
        .catch((err) => console.log(err));
    },
    [watching, reconcileStreams]
  );

  // check if all streams are still live
  useEffect(() => {
    const intervalId = setInterval(() => {
      liveCheckStreams(accessToken);
    }, LIVE_CHECK_INTERVAL);

    return () => clearInterval(intervalId);
  }, [accessToken, liveCheckStreams]);

  // update active chat if removed
  useEffect(() => {
    let found = watching.find((e) => e == activeChat);
    if (!found) {
      setActiveChat(watching[0]);
    }
  }, [watching, activeChat]);

  // keep path in sync with order
  useEffect(() => {
    replaceSearchParams(order, playerLayout);
  }, [order, playerLayout]);

  //
  function validateToken(accessToken: string | undefined) {
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
  }

  //
  function updateUser(accessToken: string | undefined) {
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
  }

  //
  function addWatching(channel: string) {
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

    // add player
    setWatching([...watching, channel]);
    setOrder([...order, channel]);

    if (watching.length < 1) {
      setActiveChat(watching[0]);
    }
  }

  //
  function reorderWatching(channel: string, index: number, relative: boolean) {
    let fromOrder = order.findIndex((o) => o == channel);
    let toOrder = relative ? fromOrder + index : index;
    if (toOrder < 0 || toOrder > watching.length + 1) return;

    // set active chat on goto first
    if (!relative && toOrder == 0) {
      setActiveChat(channel);
    }

    // move channel to index 0
    let newOrder = [...order];
    move(newOrder, fromOrder, toOrder);
    setOrder(newOrder);
  }

  //
  function getLayoutFromSearchParams(searchParams: URLSearchParams) {
    let layout = getPlayerLayout(searchParams.get(SP_LAYOUT));
    return layout;
  }

  //
  function setSearchParamsFromLayout(layout: PlayerLayout) {
    setPlayerLayout(layout);
    replaceSearchParams(order, layout);
  }

  return (
    <div id="root" className="flex flex-col h-screen">
      <Header
        accessToken={accessToken}
        user={user}
        addWatching={addWatching}
        playerLayout={playerLayout}
        setPlayerLayout={setSearchParamsFromLayout}
      />
      <main className="relative flex h-full overflow-y-hidden">
        {user && (
          <Channels
            accessToken={accessToken}
            user={user}
            watching={watching}
            addWatching={addWatching}
            removeWatching={removeWatching}
            layout={playerLayout}
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
              isActiveChat={activeChat == e}
              reorderWatching={reorderWatching}
              removeWatching={removeWatching}
              key={`player-key-${e}`}
            />
          ))}
        </div>
        <MultiChat
          channels={order}
          activeChat={activeChat}
          updateActiveChat={setActiveChat}
        />
      </main>
    </div>
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
