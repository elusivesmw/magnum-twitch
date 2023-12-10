const TWITCH_CLIENT_ID = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;

export function getAuthHeaders(accessToken: string): Object {
  const httpOptions: Object = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Client-Id': TWITCH_CLIENT_ID,
    },
  };
  return httpOptions;
}

