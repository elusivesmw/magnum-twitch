'use client';

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useSearchParams } from 'next/navigation';
import { Stream, User } from '@/types/twitch';
import { getHeaders, getOAuthHeaders } from '@/lib/auth';
import { removeSearchParams, replaceSearchParams } from '@/lib/route';
import { PlayerView, getPlayerView } from '@/types/state';
import { createContext } from 'react';

const LS_ACCESS_TOKEN = 'ACCESS_TOKEN';
const SP_VIEW = 'v';
const VALIDATE_INTERVAL = 60 * 60 * 1000;
const LIVE_CHECK_INTERVAL = 60 * 1000;

// TOOD: replace any types
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
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // global helpers
  const searchParams = useSearchParams();

  // initial watching channels without duplicates
  // TODO: pass as params
  //const initialWatching = Array.from(new Set(params.page));
  //const initialChat = initialWatching.length > 0 ? initialWatching[0] : '';
  //const initialView = getViewFromSearchParams(searchParams);

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
    replaceSearchParams(order, playerView);
  }, [order, playerView]);

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
  function getViewFromSearchParams(searchParams: URLSearchParams) {
    let view = getPlayerView(searchParams.get(SP_VIEW));
    return view;
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
        order,
        setOrder,
        activeChat,
        setActiveChat,
        playerView,
        setPlayerView,
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
