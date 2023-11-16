'use client';

import React, { useEffect, useState } from 'react';

const TWITCH_CLIENT_ID = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
const USER_ID = 9214095;

interface Stream {
  game_id: string;
  game_name: string;
  id: string;
  is_mature: boolean;
  language: string;
  started_at: Date;
  tag_ids: string[];
  tags: string[];
  thumbnail_url: string;
  title: string;
  type: string;
  user_id: string;
  user_login: string;
  user_name: string;
  viewer_count: number;
}


const Following = ({
  addWatching,
}: {
  addWatching: (channel: string) => void;
}) => {
  let [access_token, setAccessToken] = useState(null);
  useEffect(() => {
    let hash = HashValues();
    let token = hash.access_token;
    if (!token) return;
    setAccessToken(token);
  }, []);

  let [channels, setChannels] = useState<Stream[]>([]);
  useEffect(() => {
    if (!access_token) return;
    GetFollowedChannels(access_token).then((res) => {
      setChannels(res);
    });
  }, [access_token]);

  return (
    <div className="flex flex-col flex-wrap bg-twitchbg w-[240px]">
      <div className="flex h-[50px] text-center items-center justify-center">
        <span className="uppercase font-bold text-xs">Followed Channels</span>
      </div>
      {!access_token &&
        <span className="px-[10px] py-[5px]">
          <a href={`https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${TWITCH_CLIENT_ID}&redirect_uri=http://localhost:3000&scope=user:read:follows`}>
            Login
          </a>
        </span>
      }
      {channels.map((e, i) => {
        console.log(e);
        return (
          <div
            className="px-[10px] py-[5px] cursor-pointer hover:bg-twitchbghover"
            onClick={() => addWatching(e.user_login)}
          >
            <span className="h-[42px]" key={i}>
              {e.user_name}
            </span>
            <span className="block text-xs text-twitchfadedtext">{e.game_name}</span>
          </div>
        );
      })}
    </div>
  );
};

const HashValues = () => {
  let hash = document.location.hash.substr(1);
  var params: any = {};
  hash.split('&').map((hashkey) => {
    let temp = hashkey.split('=');
    params[temp[0]] = temp[1];
  });
  console.log(params);
  return params;
};

const GetFollowedChannels = (access_token: string): Promise<Stream[]> => {
  const httpOptions: Object = {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Client-Id': TWITCH_CLIENT_ID,
    },
  };
  let data = fetch(
    `https://api.twitch.tv/helix/streams/followed?user_id=${USER_ID}&first=100`,
    httpOptions
  )
    .then((res) => res.json())
    .then((json) => {
      return json.data as Stream[];
    });
  return data;
};

export default Following;

