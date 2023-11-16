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

interface User {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  created_at: string;
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

  let [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    if (!access_token) return;
    GetUsers(access_token, channels).then((res) => {
      setUsers(res);
    });
  }, [channels]);

  return (
    <div className="flex flex-col flex-wrap bg-twitchbg w-[240px]">
      <div className="flex h-[50px] text-center items-center justify-center">
        <span className="uppercase font-bold text-xs">Followed Channels</span>
      </div>
      {!access_token && (
        <span className="px-[10px] py-[5px]">
          <a
            href={`https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${TWITCH_CLIENT_ID}&redirect_uri=http://localhost:3000&scope=user:read:follows`}
          >
            Login
          </a>
        </span>
      )}
      {channels.map((channel, i) => {
        let user = users.find((u) => u.id == channel.user_id);

        return (
          <div
            className="flex px-[10px] py-[5px] cursor-pointer hover:bg-twitchbghover"
            onClick={() => addWatching(channel.user_login)}
            key={i}
          >
            <div className="h-[30px] max-w-[30px]">
              {user && (
                <img
                  src={user.profile_image_url}
                  alt={`${channel.user_name} profile`}
                  className="w-full max-w-full rounded-2xl object-cover"
                />
              )}
            </div>
            <div className="flex justify-between content-center ml-[10px] grow">
              <div className="">
                <span
                  className="block text-[#dedee3] text-sm font-semibold"
                  key={i}
                >
                  {channel.user_name}
                </span>
                <span className="inline-block text-xs text-twitchfadedtext">
                  {channel.game_name}
                </span>
              </div>
              <div className="inline-block ml-[5px]">
                <div className="flex items-center">
                  <div className="inline-block bg-[#eb0400] h-[8px] w-[8px] rounded rl-[5px]"></div>
                  <div className="text-xs ml-[5px]">{channel.viewer_count}</div>
                </div>
              </div>
            </div>
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

const GetUsers = (
  access_token: string,
  channels: Stream[]
): Promise<User[]> => {
  let ids = channels.map((c) => c.user_id);
  let ids_param = 'id=' + ids.join('&id=');

  const httpOptions: Object = {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Client-Id': TWITCH_CLIENT_ID,
    },
  };
  let data = fetch(
    `https://api.twitch.tv/helix/users?${ids_param}`,
    httpOptions
  )
    .then((res) => res.json())
    .then((json) => {
      return json.data as User[];
    });
  return data;
};

export default Following;
