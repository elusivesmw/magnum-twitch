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
import { getHeaders } from '@/lib/auth';
import { replaceSearchParams } from '@/lib/route';
import { PlayerView } from '@/types/state';
import { createContext } from 'react';
import {
  getLsFollowedCategories,
  setLsFollowedCategories,
} from '@/lib/local-storage';
import { useToken } from '@/hooks/token';

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

  // update active chat if removed
  useEffect(() => {
    let found = watching.find((e) => e == activeChat);
    if (!found) {
      setActiveChat(watching[0]);
    }
  }, [watching, activeChat]);

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
    console.log('watching in reorder', watching);
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

  // NOTE: possible move all this into token/reconcile hook:
  // ----------------
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
  // ----------------

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
