'use client';

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useSearchParams } from 'next/navigation';
import { FollowedGame, Stream, User } from '@/types/twitch';
import { getHeaders, getOAuthHeaders } from '@/lib/auth';
import { removeSearchParams, replaceSearchParams } from '@/lib/route';
import { PlayerView } from '@/types/state';
import { createContext } from 'react';
import { getLsFollowedGames, setLsFollowedGames } from '@/lib/local-storage';

const LS_ACCESS_TOKEN = 'ACCESS_TOKEN';
const VALIDATE_INTERVAL = 60 * 60 * 1000;
const LIVE_CHECK_INTERVAL = 60 * 1000;

interface AppContextType {
  accessToken: string | undefined;
  setAccessToken: Dispatch<SetStateAction<string | undefined>>;
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  watching: string[];
  setWatching: Dispatch<SetStateAction<string[]>>;
  order: string[];
  setOrder: Dispatch<SetStateAction<string[]>>;
  activeChat: string;
  setActiveChat: Dispatch<SetStateAction<string>>;
  playerView: PlayerView;
  setPlayerView: Dispatch<SetStateAction<PlayerView>>;
  followedGames: FollowedGame[];
  setFollowedGames: Dispatch<SetStateAction<FollowedGame[]>>;
  updatePath: boolean;
  setUpdatePath: Dispatch<SetStateAction<boolean>>;
  addWatching: (channel: string) => void;
  removeWatching: (channel: string) => void;
  reorderWatching: (channel: string, index: number, relative: boolean) => void;
  saveFollowedGames: (followedGames: FollowedGame[]) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // global helpers
  const searchParams = useSearchParams();

  const initialWatching: string[] = [];
  const initialChat = '';
  const initialView = PlayerView.Grid;

  // state
  const [accessToken, setAccessToken] = useState<string | undefined>();
  const [user, setUser] = useState<User | undefined>();
  const [watching, setWatching] = useState<string[]>(initialWatching);
  const [order, setOrder] = useState<string[]>(initialWatching);
  const [activeChat, setActiveChat] = useState(initialChat);
  const [playerView, setPlayerView] = useState<PlayerView>(initialView);
  const [followedGames, setFollowedGames] = useState<FollowedGame[]>([]);
  const [updatePath, setUpdatePath] = useState<boolean>(false);

  // set token
  useEffect(() => {
    if (getError(searchParams)) {
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

  // update active chat if removed
  useEffect(() => {
    let found = watching.find((e) => e == activeChat);
    if (!found) {
      setActiveChat(watching[0]);
    }
  }, [watching, activeChat]);

  // keep path in sync with order
  useEffect(() => {
    if (!updatePath) return;
    replaceSearchParams(order, playerView);
  }, [order, playerView, updatePath]);

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

  useEffect(() => {
    let games = getLsFollowedGames();
    setFollowedGames(games);
  }, []);

  function saveFollowedGames(followedGames: FollowedGame[]) {
    console.log('save');
    setLsFollowedGames(followedGames);
    setFollowedGames(followedGames);
  }

  return (
    <AppContext.Provider
      value={{
        accessToken,
        setAccessToken,
        user,
        setUser,
        watching,
        setWatching,
        addWatching,
        removeWatching,
        reorderWatching,
        order,
        setOrder,
        activeChat,
        setActiveChat,
        playerView,
        setPlayerView,
        updatePath,
        setUpdatePath,
        followedGames,
        setFollowedGames,
        saveFollowedGames,
      }}
    >
      {children}
    </AppContext.Provider>
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
