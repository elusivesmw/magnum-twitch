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
import { Category, Stream, User } from '@/types/twitch';
import { getHeaders, getOAuthHeaders } from '@/lib/auth';
import { removeSearchParams, replaceSearchParams } from '@/lib/route';
import { PlayerView } from '@/types/state';
import { createContext } from 'react';
import {
  clearLsToken,
  getLsFollowedCategories,
  getLsToken,
  setLsFollowedCategories,
} from '@/lib/local-storage';

const VALIDATE_INTERVAL = 60 * 60 * 1000;
const LIVE_CHECK_INTERVAL = 60 * 1000;

interface AppContextType {
  accessToken: string | undefined;
  setAccessToken: Dispatch<SetStateAction<string | undefined>>;
  clearAccessToken: () => void;
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
  followedCategories: Category[];
  setFollowedCategories: Dispatch<SetStateAction<Category[]>>;
  updatePath: boolean;
  setUpdatePath: Dispatch<SetStateAction<boolean>>;
  addWatching: (channel: string) => void;
  removeWatching: (channel: string) => void;
  reorderWatching: (channel: string, index: number, relative: boolean) => void;
  saveFollowedCategories: (followedCategories: Category[]) => void;
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
  const [followedCategories, setFollowedCategories] = useState<Category[]>([]);
  const [updatePath, setUpdatePath] = useState<boolean>(false);

  // set token
  useEffect(() => {
    if (getError(searchParams)) {
      removeSearchParams(order);
    }
    let token = getLsToken();
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

  // validate that the token is still valid
  function validateToken(accessToken: string | undefined) {
    if (!accessToken) {
      return;
    }
    const httpOptions = getOAuthHeaders(accessToken);
    fetch('https://id.twitch.tv/oauth2/validate', httpOptions)
      .then((res) => {
        if (!res.ok) {
          // token no good, clear
          clearAccessToken();
          return Promise.reject(res);
        }
        console.log('Valid token');
      })
      .catch((err) => console.log(err));
  }

  // clear the access token from local storage and state
  function clearAccessToken() {
    clearLsToken();
    setAccessToken(undefined);
  }

  // update the user from access token
  function updateUser(accessToken: string | undefined) {
    if (!accessToken) {
      setUser(undefined);
      return;
    }
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

  // add channel to watching state
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

  // remove channel from watching state
  const removeWatching = useCallback(
    (channel: string) => {
      if (!watching.find((e) => e == channel)) return;

      // remove player
      setWatching((w) => w.filter((e) => e != channel));
      setOrder((o) => o.filter((e) => e != channel));
    },
    [watching, setWatching, setOrder]
  );

  // reorder channel in order state
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

  // remove streams from watching if no longer live
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

  // check if all streams are still live on interval
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

  // check if all streams are still live on interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      liveCheckStreams(accessToken);
    }, LIVE_CHECK_INTERVAL);

    return () => clearInterval(intervalId);
  }, [accessToken, liveCheckStreams]);

  // get initial followed categories
  useEffect(() => {
    let games = getLsFollowedCategories();
    setFollowedCategories(games);
  }, []);

  // save followed categories to local storage and state
  function saveFollowedCategories(followedCategories: Category[]) {
    setLsFollowedCategories(followedCategories);
    setFollowedCategories(followedCategories);
  }

  return (
    <AppContext.Provider
      value={{
        accessToken,
        setAccessToken,
        clearAccessToken,
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
        followedCategories,
        setFollowedCategories,
        saveFollowedCategories,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

function move(order: string[], from: number, to: number) {
  order.splice(to, 0, order.splice(from, 1)[0]);
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
