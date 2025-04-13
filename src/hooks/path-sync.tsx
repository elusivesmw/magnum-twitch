'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getPlayerView, PlayerView } from '@/types/state';

/**
 * Hook to synchronize URL path and state.
 */
export function usePathSync(
  setWatching: (w: string[]) => void,
  order: string[],
  setOrder: (order: string[]) => void,
  playerView: PlayerView,
  setPlayerView: (view: PlayerView) => void
) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // block updates until path to state is complete
  const hasSynced = useRef(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // NOTE: prevent flashing of routes
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // initial path to state
  useEffect(() => {
    // don't proceed after initial path -> state
    // unless navigating to home (clear all state)
    if (hasSynced.current && pathname !== '/') return;

    const pathSegments = pathname.split('/').filter(Boolean);
    const viewParam = searchParams.get('v');
    const view = getPlayerView(viewParam);

    setWatching(pathSegments);
    setOrder(pathSegments);
    setPlayerView(view);

    hasSynced.current = true;
  }, [pathname, searchParams, setWatching, setOrder, setPlayerView]);

  // sync state to path
  useEffect(() => {
    // wait til page is hydrated and path -> state has syned
    if (!isHydrated || !hasSynced.current) return;

    const newPath = `/${order.join('/')}`;
    const newQuery = `?v=${playerView}`;
    const newUrl = newPath + newQuery;
    const currentUrl = window.location.pathname + window.location.search;

    if (newUrl !== currentUrl) {
      window.history.replaceState({}, '', newUrl);
    }
  }, [isHydrated, order, playerView]);
}
