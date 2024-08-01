'use client';

import Player from '@/components/player';
import MultiChat from '@/components/chat';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Stream, User } from '@/types/twitch';
import { getHeaders, getOAuthHeaders } from '@/lib/auth';
import { removeSearchParams, replaceSearchParams } from '@/lib/route';
import { PlayerView, getPlayerView } from '@/types/state';
import Header from '@/components/header';
import Channels from '@/components/channels';
import { AppContext } from '@/context/context';

const LS_ACCESS_TOKEN = 'ACCESS_TOKEN';
const SP_VIEW = 'v';
const VALIDATE_INTERVAL = 60 * 60 * 1000;
const LIVE_CHECK_INTERVAL = 60 * 1000;

export default function Home({ params }: { params: { page: string[] } }) {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('This component requires AppProvider as a parent');
  }

  const {
    accessToken,
    setAccessToken,
    user,
    setUser,
    watching,
    setWatching,
    order,
    setOrder,
    activeChat,
    setActiveChat,
    playerView,
    setPlayerView,
  } = context;

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
  const removeWatching = useCallback(
    (channel: string) => {
      if (!watching.find((e) => e == channel)) return;

      // remove player
      setWatching((w) => w.filter((e) => e != channel));
      setOrder((o) => o.filter((e) => e != channel));
    },
    [watching, setWatching, setOrder]
  );

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

  //
  function setSearchParamsFromView(view: PlayerView) {
    setPlayerView(view);
    replaceSearchParams(order, view);
  }

  // global helpers
  //const searchParams = useSearchParams();

  //// initial watching channels without duplicates
  //const initialWatching = Array.from(new Set(params.page));
  //const initialChat = initialWatching.length > 0 ? initialWatching[0] : '';
  //const initialView = getViewFromSearchParams(searchParams);

  //// state
  //const [accessToken, setAccessToken] = useState<string | undefined>();
  //const [user, setUser] = useState<User | undefined>();
  //const [watching, setWatching] = useState<string[]>(initialWatching);
  //const [order, setOrder] = useState<string[]>(initialWatching);
  //const [activeChat, setActiveChat] = useState(initialChat);
  //const [playerView, setPlayerView] = useState<PlayerView>(initialView);
  return (
    <div id="root" className="flex flex-col h-screen">
      <Header
        accessToken={accessToken}
        user={user}
        addWatching={addWatching}
        playerView={playerView}
        setPlayerView={setSearchParamsFromView}
      />
      <main className="relative flex h-full overflow-y-hidden">
        {user && (
          <Channels
            accessToken={accessToken}
            user={user}
            watching={watching}
            addWatching={addWatching}
            removeWatching={removeWatching}
            view={playerView}
          />
        )}
        <div
          id="player-container"
          className={`flex ${playerClass(
            playerView
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
          setActiveChat={setActiveChat}
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

function playerClass(view: PlayerView) {
  switch (view) {
    case PlayerView.Vertical:
      return 'flex-col flex-nowrap vertical';
    case PlayerView.Spotlight:
      return 'flex-row flex-wrap spotlight';
    case PlayerView.Grid:
    default:
      return 'flex-row flex-wrap';
  }
}
