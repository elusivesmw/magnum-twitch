'use client';

import { useEffect, useState } from 'react';
import { Stream, User } from '@/types/twitch';
import { getHeaders } from '@/lib/auth';
import { replacePath } from '@/lib/route';
import Image from 'next/image';

const GAME_ID = 1229;
const POLL_INTERVAL = 60 * 1000;

const Game = ({
  accessToken,
  watching,
  addWatching,
  removeWatching,
}: {
  accessToken: string | undefined;
  watching: string[];
  addWatching: (stream: string) => void;
  removeWatching: (stream: string) => void;
}) => {
  let [streams, setStreams] = useState<Stream[] | undefined>();
  useEffect(() => {
    if (accessToken) {
      // remove token from url
      // NOTE: this won't preserve order, but this is an edge case so ¯\_(ツ)_/¯
      replacePath(watching);
    }

    updateStreams(accessToken);
    const intervalId = setInterval(() => {
      updateStreams(accessToken);
    }, POLL_INTERVAL);

    return () => clearInterval(intervalId);
  }, [accessToken, watching]);

  let [users, setUsers] = useState<User[] | undefined>();
  useEffect(() => {
    updateUsers(accessToken, streams);
  }, [accessToken, streams]);

  const updateStreams = (accessToken: string | undefined) => {
    if (!accessToken) return;
    const httpOptions = getHeaders(accessToken);
    fetch(
      `https://api.twitch.tv/helix/streams/?game_id=${GAME_ID}&first=100`,
      httpOptions
    )
      .then((res) => res.json())
      .then((json) => {
        let streams = json.data as Stream[];
        setStreams(streams);
      })
      .catch((err) => console.log(err));
  };

  const updateUsers = (
    accessToken: string | undefined,
    streams: Stream[] | undefined
  ) => {
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
      })
      .catch((err) => console.log(err));
  };

  let [showModal, setShowModal] = useState<boolean>(false);
  let [modalStream, setModalStream] = useState<Stream>();
  const showTooltip = (
    e: React.MouseEvent<HTMLDivElement>,
    stream: Stream | undefined
  ) => {
    let target = e.target as HTMLDivElement;
    if (!target) return;
    if (!stream) return;

    e.stopPropagation();
    setModalStream(stream);
    if (e.type == 'mouseover') {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  };

  return (
    <div>
      {streams &&
        streams.map((stream, i) => {
          let user = users?.find((u) => u.id == stream.user_id);
          let isWatching = watching?.includes(stream.user_login);
          return (
            <StreamGrid
              stream={stream}
              user={user}
              isWatching={isWatching}
              addWatching={addWatching}
              removeWatching={removeWatching}
              showTooltip={showTooltip}
              key={i}
            />
          );
        })}
    </div>
  );
};

const StreamGrid = ({
  stream,
  user,
  isWatching,
  addWatching,
  removeWatching,
  showTooltip: showTooltip,
}: {
  stream: Stream;
  user: User | undefined;
  isWatching: boolean;
  addWatching: (stream: string) => void;
  removeWatching: (stream: string) => void;
  showTooltip: (
    e: React.MouseEvent<HTMLDivElement>,
    stream: Stream | undefined
  ) => void;
}) => {
  const updateWatching = (stream: string) => {
    if (!isWatching) {
      addWatching(stream);
    } else {
      removeWatching(stream);
    }
  };

  return (
    <div
      id={`game-stream-${stream.user_login}`}
      data-stream={user?.login}
      className="flex max-w-full h-[4.2rem] px-4 py-2 cursor-pointer hover:bg-sidepanelhover"
      onClick={() => updateWatching(stream.user_login)}
      onMouseOver={(e) => showTooltip(e, stream)}
      onMouseOut={(e) => showTooltip(e, stream)}
    >
      <div className="basis-[30px] grow-0 shrink-0 self-center">
        {user && (
          <Image
            src={user.profile_image_url}
            alt={`${stream.user_name} profile`}
            className="w-full max-w-full rounded-full object-cover"
            width={30}
            height={30}
          />
        )}
      </div>
      <div
        className={`${
          !open ? 'hidden' : ''
        } flex justify-between content-center ml-4 grow min-w-0`}
      >
        <div className="flex flex-col shrink overflow-hidden">
          <p
            className={`${
              isWatching ? 'text-twpurple' : 'text-[#dedee3]'
            } text-base font-semibold leading-tight truncate`}
          >
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
}

export default Game;
