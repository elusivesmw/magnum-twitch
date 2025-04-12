'use client';

import { ReactNode, useState } from 'react';
import { Category, User } from '@/types/twitch';
import { PlayerView } from '@/types/state';
import { createContext } from 'react';
import { useWatchingManager } from '@/hooks/watching-manager';
import { useCategoryManager } from '@/hooks/category-manager';

interface AppContextType {
  accessToken: string | undefined;
  setAccessToken: (token: string | undefined) => void;
  user: User | undefined;
  setUser: (user: User | undefined) => void;
  watching: string[];
  setWatching: (watching: string[]) => void;
  order: string[];
  setOrder: (order: string[]) => void;
  activeChat: string;
  setActiveChat: (chat: string) => void;
  playerView: PlayerView;
  setPlayerView: (view: PlayerView) => void;
  followedCategories: Category[];
  setFollowedCategories: (categories: Category[]) => void;
  updatePath: boolean;
  setUpdatePath: (update: boolean) => void;
  addWatching: (channel: string) => void;
  removeWatching: (channel: string) => void;
  reorderWatching: (channel: string, index: number, relative: boolean) => void;
  saveFollowedCategories: (followedCategories: Category[]) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // global helpers
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

  // watching helper methods based on other states
  const { addWatching, removeWatching, reorderWatching } = useWatchingManager(
    watching,
    setWatching,
    order,
    setOrder,
    activeChat,
    setActiveChat
  );

  // category helper methods based on other states
  const { saveFollowedCategories } = useCategoryManager(setFollowedCategories);

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
