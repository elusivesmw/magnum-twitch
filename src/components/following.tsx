'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stream, User } from '@/types/twitch';
import { CollapseLeft, CollapseRight, Heart } from './icons';

const TWITCH_CLIENT_ID = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;

const USER_ID = 9214095;
const GAME_ID = 1229;
const POLL_INTERVAL = 60 * 1000;

const Following = ({
  accessToken,
  addWatching,
}: {
  accessToken: string | null;
  addWatching: (stream: string) => void;
}) => {
  const router = useRouter();

  let [streams, setStreams] = useState<Stream[]>([]);
  useEffect(() => {
    if (accessToken) {
      // remove token from url
      router.replace('/');
    }

    updateStreams();
    // probably should use event sub eventually
    const intervalId = setInterval(() => {
      updateStreams();
    }, POLL_INTERVAL);

    return () => clearInterval(intervalId);
  }, [accessToken]);

  let [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    updateUsers();
  }, [streams]);

  const updateStreams = () => {
    if (!accessToken) return;
    const httpOptions: Object = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Client-Id': TWITCH_CLIENT_ID,
      },
    };
    fetch(
      //`https://api.twitch.tv/helix/streams/?game_id=${GAME_ID}&first=100`,
      `https://api.twitch.tv/helix/streams/followed?user_id=${USER_ID}&first=100`,
      httpOptions
    )
      .then((res) => res.json())
      .then((json) => {
        let streams = json.data as Stream[];
        setStreams(streams);
      });
  };

  const updateUsers = () => {
    if (!accessToken) return;
    let ids = streams.map((s) => s.user_id);
    let ids_param = 'id=' + ids.join('&id=');

    const httpOptions: Object = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Client-Id': TWITCH_CLIENT_ID,
      },
    };
    fetch(`https://api.twitch.tv/helix/users?${ids_param}`, httpOptions)
      .then((res) => res.json())
      .then((json) => {
        let users = json.data as User[];
        setUsers(users);
      });
  };


  let [open, setOpen] = useState<boolean>(true);
  const toggleOpen = () => {
    setOpen(!open);
  }

  return (
    <div className={`flex flex-col bg-sidepanel ${open ? "basis-[240px]" : "basis-[50px]"} shrink-0 grow-0 overflow-y-scroll scrollbar`}>
      <div className="flex shrink-0 grow-0 max-w-full text-center items-center justify-between mt-4 pl-4 pr-2">
        <span className={`${open ? "" : "hidden"} font-semibold text-xl`}>For You</span>
        <button
          onClick={toggleOpen}
          className="inline-flex h-[30px] p-2 bg-twbuttonbg hover:bg-opacity-[0.48] rounded-[4px]">
          {open ?
            <CollapseLeft />
            :
            <CollapseRight />
          }
        </button>
      </div>
      <div className={`flex basis-20 shrink-0 grow-0 max-w-full text-center items-center ${open ? "justify-start" : "justify-center"} px-4`}>
        <span className={`${!open ? "hidden": ""} uppercase font-bold text-sm`}>Followed Channels</span>
        <div className={`${open ? "hidden" : ""} h-8`}><Heart /></div>
      </div>
      {streams.map((stream, i) => {
        let user = users.find((u) => u.id == stream.user_id);
        return (
          <StreamRow
            stream={stream}
            user={user}
            open={open}
            addWatching={addWatching}
            key={i}
          />
        );
      })}
    </div>
  );
};

const StreamRow = ({
  stream,
  user,
  open,
  addWatching,
}: {
  stream: Stream;
  user: User | undefined;
  open: boolean;
  addWatching: (stream: string) => void;
}) => {
  return (
    <div
      className="flex max-w-full px-4 py-2 cursor-pointer hover:bg-sidepanelhover"
      onClick={() => addWatching(stream.user_login)}
    >
      <div className="basis-[30px] grow-0 shrink-0 self-center">
        {user && (
          <img
            src={user.profile_image_url}
            alt={`${stream.user_name} profile`}
            className="w-full max-w-full rounded-full object-cover"
          />
        )}
      </div>
      <div className={`${!open ? "hidden" : ""} flex justify-between content-center ml-2 grow min-w-0`}>
        <div className="flex flex-col shrink overflow-hidden">
          <p className="text-[#dedee3] text-base font-semibold truncate">
            {stream.user_name}
          </p>
          <p className="text-sm text-twfadedtext truncate">
            {stream.game_name}
          </p>
        </div>
        <div className="inline-block min-w-[40px] ml-2">
          <div className="flex items-center">
            <div className="inline-block bg-[#eb0400] h-[8px] w-[8px] rounded-full rl-2"></div>
            <div className="text-sm ml-2">
              {displayViewerCount(stream.viewer_count)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const displayViewerCount = (viewerCount: number) => {
  if (viewerCount > 1000) {
    let rounded = Number.parseFloat((viewerCount / 1000).toFixed(1)).toString();
    return `${rounded}K`;
  }
  return viewerCount;
};

export default Following;
