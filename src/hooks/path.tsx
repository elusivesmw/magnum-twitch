'use client';

import { useEffect, useRef } from 'react';
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
  const isSyncing = useRef(false);
  const lastPath = useRef<string | null>(null);

  // path to state
  useEffect(() => {
    // safegaurd
    if (isSyncing.current) return;

    // get path segments and view
    const segments = pathname.split('/').filter(Boolean);
    const uniqueSegments = Array.from(new Set(segments));
    const view = getPlayerView(
      new URLSearchParams(window.location.search).get('v')
    );
    console.log('test1', view);

    // check if path has changed
    const prevSegments = (lastPath.current ?? '').split('/').filter(Boolean);
    const prevSet = new Set(prevSegments);
    // are the two sets of segments the same?
    const sameSet =
      uniqueSegments.length === prevSet.size &&
      uniqueSegments.every((seg) => prevSet.has(seg));

    // only update if the sets differ
    if (!sameSet) {
      setWatching(uniqueSegments);
      setOrder(uniqueSegments);
    }

    setPlayerView(view);
    lastPath.current = pathname;
  }, [pathname, searchParams, setWatching, setOrder, setPlayerView]);

  // state to path
  useEffect(() => {
    if (isSyncing.current) return;

    const newPath = `/${order.join('/')}`;
    const newSearchParams = `?v=${playerView}`;
    console.log('test', newSearchParams);
    const newFullPath = newPath + newSearchParams;
    const currentFullPath = window.location.pathname + window.location.search;

    // only update the path if something has changed
    if (newFullPath !== currentFullPath) {
      // disable syncing path to state
      isSyncing.current = true;
      window.history.replaceState({}, '', newFullPath);
      lastPath.current = newPath;
      // re-enable syncing path to state
      isSyncing.current = false;
    }
  }, [order, playerView]);
}
