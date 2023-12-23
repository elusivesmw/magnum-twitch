const TWITCH_CLIENT_ID = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;

export function getHeaders(accessToken: string): Object {
  const httpOptions: Object = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Client-Id': TWITCH_CLIENT_ID,
    },
  };
  return httpOptions;
}

export function getOAuthHeaders(accessToken: string): Object {
  const httpOptions: Object = {
    headers: {
      Authorization: `OAuth ${accessToken}`,
    },
  };
  return httpOptions;
}
