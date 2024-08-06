const TWITCH_CLIENT_ID = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const LOGIN_LINK = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${TWITCH_CLIENT_ID}&redirect_uri=${BASE_URL}&scope=user:read:follows`;

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
