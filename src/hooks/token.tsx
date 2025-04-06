'use client';

import { getHeaders, getOAuthHeaders } from '@/lib/auth';
import { clearLsToken, getLsToken } from '@/lib/local-storage';
import { removeSearchParams } from '@/lib/route';
import { User } from '@/types/twitch';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect } from 'react';

const VALIDATE_INTERVAL = 60 * 60 * 1000;

/**
 * Hook to get, set, and validate tokens.
 */
export function useToken(
  accessToken: string | undefined,
  setAccessToken: (token: string | undefined) => void,
  setUser: (user: User | undefined) => void
) {
  console.log('test useToken');
  const searchParams = useSearchParams();
  //const isSyncing = useRef(false);

  // set token
  useLayoutEffect(() => {
    console.log('test set token');
    if (getError(searchParams)) {
      console.log('test here');
      removeSearchParams([]);
    }
    let token = getLsToken();
    console.log('test token from ls', token);
    if (!token) return;

    setAccessToken(token);
    console.log('test set access token');
  }, [searchParams, setAccessToken]);

  // update the user from access token
  const updateUser = useCallback(
    (accessToken: string | undefined) => {
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
    },
    [setUser]
  );

  // validate that the token is still valid
  const validateToken = useCallback(
    (accessToken: string | undefined) => {
      if (!accessToken) {
        return;
      }
      const httpOptions = getOAuthHeaders(accessToken);
      fetch('https://id.twitch.tv/oauth2/validate', httpOptions)
        .then((res) => {
          if (!res.ok) {
            // token no good, clear
            clearLsToken();
            setAccessToken(undefined);
            return Promise.reject(res);
          }
          console.log('Valid token');
        })
        .catch((err) => console.log(err));
    },
    [setAccessToken]
  );

  // validate token every hour
  useEffect(() => {
    validateToken(accessToken);
    const intervalId = setInterval(() => {
      validateToken(accessToken);
    }, VALIDATE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [accessToken, validateToken]);

  // set user
  useEffect(() => {
    updateUser(accessToken);
    console.log('test update user');
  }, [accessToken, updateUser]);
}

function getError(searchParams: URLSearchParams) {
  if (!searchParams) return false;
  //const error = searchParams.get('error');
  const description = searchParams.get('error_description');
  //const state = searchParams.get('state');
  if (!description) return false;

  console.error(description);
  return true;
}
