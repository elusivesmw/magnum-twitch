'use client';

import React, { useEffect, useState } from 'react';
import { Stream, User } from '@/types/twitch';
import { CollapseLeft, CollapseRight, Heart } from './icons';
import { getHeaders } from '@/lib/auth';
import { replacePath } from '@/lib/route';

const GAME_ID = 1229;
const POLL_INTERVAL = 60 * 1000;

const Following = ({
  accessToken,
  user,
  watching,
  addWatching,
}: {
  accessToken: string | undefined;
  user: User;
  watching: string[];
  addWatching: (stream: string) => void;
}) => {
  let [streams, setStreams] = useState<Stream[] | undefined>();
  useEffect(() => {
    if (accessToken) {
      // remove token from url
      // NOTE: this won't preserve order, but this is an edge case so ¯\_(ツ)_/¯
      replacePath(watching);
    }

    updateStreams();
    const intervalId = setInterval(() => {
      updateStreams();
    }, POLL_INTERVAL);

    return () => clearInterval(intervalId);
  }, [accessToken]);

  let [users, setUsers] = useState<User[] | undefined>();
  useEffect(() => {
    updateUsers();
  }, [streams]);

  const updateStreams = () => {
    if (!accessToken) return;
    const httpOptions = getHeaders(accessToken);
    fetch(
      //`https://api.twitch.tv/helix/streams/?game_id=${GAME_ID}&first=100`,
      `https://api.twitch.tv/helix/streams/followed?user_id=${user.id}&first=100`,
      httpOptions
    )
      .then((res) => res.json())
      .then((json) => {
        let streams = json.data as Stream[];
        setStreams(streams);
      }).catch((err) => console.log(err));
  };

  const updateUsers = () => {
    if (!accessToken) return;
    if (!streams) return;
    // no online streams to get user data for
    if (streams.length == 0) return;

    let ids = streams.map((s) => s.user_id);
    let ids_param = 'id=' + ids.join('&id=');

    const httpOptions = getHeaders(accessToken);
    fetch(`https://api.twitch.tv/helix/users?${ids_param}`, httpOptions)
      .then((res) => res.json())
      .then((json) => {
        let users = json.data as User[];
        setUsers(users);
      }).catch((err)  => console.log(err));
  };

  let [open, setOpen] = useState<boolean>(true);
  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <div
      className={`flex flex-col bg-sidepanel ${
        open ? 'basis-[240px]' : 'basis-[50px]'
      } shrink-0 grow-0 overflow-y-scroll scrollbar`}
    >
      <div className="flex shrink-0 grow-0 max-w-full text-center items-center justify-between mt-4 pl-4 pr-2">
        <span className={`${open ? '' : 'hidden'} font-semibold text-xl`}>
          For You
        </span>
        <button
          onClick={toggleOpen}
          className="inline-flex h-[30px] p-2 hover:bg-twbuttonbg hover:bg-opacity-[0.48] rounded-[4px]"
        >
          {open ? <CollapseLeft /> : <CollapseRight />}
        </button>
      </div>
      <div
        className={`flex basis-20 shrink-0 grow-0 max-w-full text-center items-center ${
          open ? 'justify-start' : 'justify-center'
        } px-4`}
      >
        <span
          className={`${!open ? 'hidden' : ''} uppercase font-bold text-sm`}
        >
          Followed Channels
        </span>
        <div className={`${open ? 'hidden' : ''} h-8`}>
          <Heart />
        </div>
      </div>
      {streams && streams.map((stream, i) => {
        let user = users?.find((u) => u.id == stream.user_id);
        let isWatching = watching?.includes(stream.user_login);
        return (
          <StreamRow
            stream={stream}
            user={user}
            open={open}
            isWatching={isWatching}
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
  isWatching,
  addWatching,
}: {
  stream: Stream;
  user: User | undefined;
  open: boolean;
  isWatching: boolean;
  addWatching: (stream: string) => void;
}) => {
  return (
    <div
      className="flex max-w-full h-[4.2rem] px-4 py-2 cursor-pointer hover:bg-sidepanelhover"
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
      <div
        className={`${
          !open ? 'hidden' : ''
        } flex justify-between content-center ml-4 grow min-w-0`}
      >
        <div className="flex flex-col shrink overflow-hidden">
          <p className={`${isWatching ? 'text-twpurple' : 'text-[#dedee3]'} text-base font-semibold leading-tight truncate`}>
            {stream.user_name}
          </p>
          <p className="text-sm text-twfadedtext leading-tight truncate">
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

function displayViewerCount(viewerCount: number) {
  if (viewerCount > 1000) {
    let rounded = Number.parseFloat((viewerCount / 1000).toFixed(1)).toString();
    return `${rounded}K`;
  }
  return viewerCount;
};

export default Following;
