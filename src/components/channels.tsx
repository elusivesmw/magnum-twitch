'use client';

import { useCallback, useEffect, useState } from 'react';
import { Stream, User } from '@/types/twitch';
import {
  ArrowDown,
  BrokenHeart,
  CollapseLeft,
  CollapseRight,
  HollowHeart,
  SolidHeart,
} from './icons';
import { getHeaders } from '@/lib/auth';
import { replaceSearchParams } from '@/lib/route';
import Image from 'next/image';
import { FollowingTooltip } from './tooltip';
import { SectionType } from '@/types/channel';
import { PlayerView } from '@/types/state';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';

const GAME_ID = 1229;
const POLL_INTERVAL = 60 * 1000;

const Channels = ({
  accessToken,
  user,
  watching,
  addWatching,
  removeWatching,
  view,
}: {
  accessToken: string | undefined;
  user: User;
  watching: string[];
  addWatching: (stream: string) => void;
  removeWatching: (stream: string) => void;
  view: PlayerView;
}) => {
  let [visibleStreamList, setVisibleStreamList] = useState<string>('');
  let [followingStreams, setFollowingStreams] = useState<
    Stream[] | undefined
  >();
  let [notFollowingStreams, setNotFollowingStreams] = useState<
    Stream[] | undefined
  >();
  let [gameStreams, setGameStreams] = useState<Stream[] | undefined>();

  useEffect(() => {
    if (accessToken) {
      // remove token from url
      // NOTE: this won't preserve order, but this is an edge case so ¯\_(ツ)_/¯
      replaceSearchParams(watching, view);
    }

    updateFollowingStreams(accessToken, user);
    updateGameStreams(accessToken, user);
    const intervalId = setInterval(() => {
      updateFollowingStreams(accessToken, user);
      updateGameStreams(accessToken, user);
    }, POLL_INTERVAL);

    return () => clearInterval(intervalId);
  }, [accessToken, user, watching, view]);

  const updateNotFollowingStreams = useCallback(
    (
      accessToken: string | undefined,
      followingStreams: Stream[] | undefined,
      watching: string[]
    ) => {
      if (!accessToken) return;
      if (!followingStreams) return;
      let notFollowing = watching.filter(
        (w) => !followingStreams?.map((f) => f.user_login).includes(w)
      );
      if (notFollowing.length == 0) {
        setNotFollowingStreams([]);
        return;
      }
      let user_logins_param = 'user_login=' + notFollowing.join('&user_login=');
      const httpOptions = getHeaders(accessToken);
      fetch(
        `https://api.twitch.tv/helix/streams?${user_logins_param}&first=100`,
        httpOptions
      )
        .then((res) => res.json())
        .then((json) => {
          let streams = json.data as Stream[];
          setNotFollowingStreams(streams);
        })
        .catch((err) => console.log(err));
    },
    []
  );

  useEffect(() => {
    updateNotFollowingStreams(accessToken, followingStreams, watching);
  }, [accessToken, followingStreams, watching, updateNotFollowingStreams]);

  const updateFollowingStreams = (
    accessToken: string | undefined,
    user: User | undefined
  ) => {
    if (!accessToken) return;
    if (!user) return;
    const httpOptions = getHeaders(accessToken);
    fetch(
      `https://api.twitch.tv/helix/streams/followed?user_id=${user.id}&first=100`,
      httpOptions
    )
      .then((res) => res.json())
      .then((json) => {
        let streams = json.data as Stream[];
        setFollowingStreams(streams);
      })
      .catch((err) => console.log(err));
  };

  const updateGameStreams = (
    accessToken: string | undefined,
    user: User | undefined
  ) => {
    if (!accessToken) return;
    if (!user) return;
    const httpOptions = getHeaders(accessToken);
    fetch(
      `https://api.twitch.tv/helix/streams/?game_id=${GAME_ID}&first=100`,
      httpOptions
    )
      .then((res) => res.json())
      .then((json) => {
        let streams = json.data as Stream[];
        setGameStreams(streams);
      })
      .catch((err) => console.log(err));
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
        className={`relative flex basis-20 shrink-0 grow-0 max-w-full ${
          open ? 'justify-start' : 'justify-center'
        }`}
      >
        <Listbox value={visibleStreamList} onChange={setVisibleStreamList}>
          <ListboxButton className="flex justify-center items-center w-full p-4">
            {open ? (
              <div className="flex justify-between items-center w-full">
                <span className="uppercase font-bold text-sm">
                  Followed Channels
                </span>
                <ArrowDown />
              </div>
            ) : (
              <div className="flex basis-8 h-8 items-center">
                <HollowHeart />
              </div>
            )}
          </ListboxButton>
          <ListboxOptions
            anchor="bottom"
            className="translate-x-4 z-10 rounded-lg ring-1 ring-twborder bg-sidepanel uppercase text-sm"
          >
            <ListboxOption
              value="following"
              className="w-full block px-2 hover:bg-blue-500 first:rounded-t-lg last:rounded-b-lg cursor-pointer"
            >
              Followed Channels really long long long
            </ListboxOption>
            <ListboxOption
              value="mario"
              className="block px-2 hover:bg-blue-500 first:rounded-t-lg last:rounded-b-lg cursor-pointer"
            >
              Super Mario World
            </ListboxOption>
          </ListboxOptions>
        </Listbox>
      </div>

      <ChannelSection
        accessToken={accessToken}
        type={SectionType.Channel}
        headerText="Followed Channels"
        headerIcon={<HollowHeart />}
        open={open}
        watching={watching}
        streams={followingStreams}
        addWatching={addWatching}
        removeWatching={removeWatching}
      />
      {notFollowingStreams && notFollowingStreams.length > 0 && (
        <ChannelSection
          accessToken={accessToken}
          type={SectionType.NotFollowing}
          headerText="Not Followed Channels"
          headerIcon={<BrokenHeart />}
          open={open}
          watching={watching}
          streams={notFollowingStreams}
          addWatching={addWatching}
          removeWatching={removeWatching}
        />
      )}
      <ChannelSection
        accessToken={accessToken}
        type={SectionType.Game}
        headerText="Super Mario World"
        headerIcon={<SolidHeart />}
        open={open}
        watching={watching}
        streams={gameStreams}
        addWatching={addWatching}
        removeWatching={removeWatching}
      />
    </div>
  );
};

const ChannelSection = ({
  accessToken,
  type,
  headerText,
  headerIcon,
  open,
  watching,
  streams,
  addWatching,
  removeWatching,
}: {
  accessToken: string | undefined;
  type: SectionType;
  headerText: string;
  headerIcon: React.ReactNode;
  open: boolean;
  watching: string[];
  streams: Stream[] | undefined;
  addWatching: (stream: string) => void;
  removeWatching: (stream: string) => void;
}) => {
  let [users, setUsers] = useState<User[] | undefined>();
  useEffect(() => {
    updateUsers(accessToken, streams);
  }, [accessToken, streams]);

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

  //
  return (
    <>
      {streams &&
        streams.map((stream, i) => {
          let user = users?.find((u) => u.id == stream.user_id);
          let isWatching = watching?.includes(stream.user_login);
          return (
            <ChannelRow
              stream={stream}
              user={user}
              type={type}
              open={open}
              isWatching={isWatching}
              addWatching={addWatching}
              removeWatching={removeWatching}
              showTooltip={showTooltip}
              key={i}
            />
          );
        })}
      {showModal && (
        <FollowingTooltip type={type} stream={modalStream} open={open} />
      )}
    </>
  );
};

const ChannelRow = ({
  stream,
  type,
  user,
  open,
  isWatching,
  addWatching,
  removeWatching,
  showTooltip: showTooltip,
}: {
  stream: Stream;
  type: SectionType;
  user: User | undefined;
  open: boolean;
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
      id={`${type}-${stream.user_login}`}
      data-stream={user?.login}
      className="flex max-w-full h-[4.2rem] px-4 py-2 cursor-pointer hover:bg-sidepanelhover"
      onClick={() => updateWatching(stream.user_login)}
      onMouseOver={(e) => showTooltip(e, stream)}
      onMouseOut={(e) => showTooltip(e, stream)}
    >
      <div className="basis-[30px] grow-0 shrink-0 self-center mb-[2px]">
        {user && (
          <Image
            src={user.profile_image_url}
            alt={`${stream.user_name} profile`}
            className="w-full max-w-full rounded-full object-cover"
            width={30}
            height={30}
            unoptimized
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

export default Channels;
