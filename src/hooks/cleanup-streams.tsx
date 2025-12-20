import { getHeaders } from '@/lib/auth';
import { Stream } from '@/types/twitch';
import { useCallback, useEffect } from 'react';

const LIVE_CHECK_INTERVAL = 60 * 1000;

/**
 * Hook to remove channel from watching when it goes offline.
 */
export function useCleanupStreams(
  accessToken: string | undefined,
  watching: string[],
  removeWatching: (channel: string) => void
) {
  // remove streams from watching if no longer live
  const removeDeadStreams = useCallback(
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
          removeDeadStreams(s);
        })
        .catch((err) => console.error(err));
    },
    [watching, removeDeadStreams]
  );

  // check if all streams are still live on interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      liveCheckStreams(accessToken);
    }, LIVE_CHECK_INTERVAL);

    return () => clearInterval(intervalId);
  }, [accessToken, liveCheckStreams]);
}
