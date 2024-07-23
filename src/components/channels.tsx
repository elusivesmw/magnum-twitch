'use client';

import { useCallback, useEffect, useState } from 'react';
import { FollowedGame, Stream, User } from '@/types/twitch';
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
} from '@headlessui/react';
import { getUniqueBy } from '@/lib/helper';

// TODO: get these values when added,
// after adding games dynamically is implemented.
const FOLLOWED_GAMES: FollowedGame[] = [
  { game_id: 1229, game_title: 'Super Mario World' },
  { game_id: 505705, game_title: 'Noita' },
];
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
  let [visibleStreamList, setVisibleStreamList] = useState<string>('following');
  let [watchingStreams, setWatchingStreams] = useState<Stream[] | undefined>();
  // TODO: implement
  let [notVisibleStreams, setNotVisibleStreams] = useState<
    Stream[] | undefined
  >();

  let [followingStreams, setFollowingStreams] = useState<
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

  const updateWatchingStreams = useCallback(
    (
      accessToken: string | undefined,
      visibleStreamList: string,
      followingStreams: Stream[] | undefined,
      gameStreams: Stream[] | undefined,
      watching: string[]
    ) => {
      if (!accessToken) return;
      if (!followingStreams) return;

      if (followingStreams === undefined || gameStreams === undefined) return;
      const unionStreams: Stream[] = getUniqueBy(
        [...followingStreams, ...gameStreams],
        'user_id'
      );
      //console.log('union', unionStreams);

      // get watching streams data (what we dont have yet)
      let notInUnionStreamNames = watching.filter(
        (w) => !unionStreams?.map((f) => f.user_login).includes(w)
      );
      console.log('notInUnionStreams', notInUnionStreamNames);

      let user_logins_param =
        'user_login=' + notInUnionStreamNames.join('&user_login=');
      const httpOptions = getHeaders(accessToken);
      // fetch(
      //   `https://api.twitch.tv/helix/streams?${user_logins_param}`,
      //   httpOptions
      // )
      //   .then((res) => res.json())
      //   .then((json) => {
      //     let streams = json.data as Stream[];
      //     setNotFollowingStreams(streams);
      //   })
      //   .catch((err) => console.log(err));

      // TODO: fetch the not in union streams
      // and fill in the in union streams
      let inUnionStreams = unionStreams.filter((stream) =>
        watching.includes(stream.user_login)
      );
      console.log('inUnionStreams', inUnionStreams);
      setWatchingStreams(inUnionStreams);

      // update not visible streams
      //
      //
      //
      //
      if (visibleStreamList == 'following') {
        let notFollowing = inUnionStreams.filter(
          (w) =>
            !followingStreams?.map((f) => f.user_login).includes(w.user_login)
        );
        console.log('notfollowing', notFollowing);
        setNotVisibleStreams(notFollowing);
      } else {
        // game id
        let notWatchingThisGame = inUnionStreams.filter(
          (w) => !gameStreams?.map((f) => f.game_id).includes(w.game_id)
        );
        console.log('notwatchingthisgame', notWatchingThisGame);
        setNotVisibleStreams(notWatchingThisGame);
      }
    },
    []
  );

  useEffect(() => {
    updateWatchingStreams(
      accessToken,
      visibleStreamList,
      followingStreams,
      gameStreams,
      watching
    );
  }, [
    accessToken,
    visibleStreamList,
    followingStreams,
    gameStreams,
    watching,
    updateWatchingStreams,
  ]);

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

  const updateVisibleStreamList = (e: string) => {
    setVisibleStreamList(e);
    console.log('visible', e);
  };

  const updateGameStreams = (
    accessToken: string | undefined,
    user: User | undefined
  ) => {
    if (!accessToken) return;
    if (!user) return;

    // TODO: look into when more than 100 combined streams are returned
    let game_ids_param =
      'game_id=' + FOLLOWED_GAMES.map((fg) => fg.game_id).join('&game_id=');
    const httpOptions = getHeaders(accessToken);
    fetch(
      `https://api.twitch.tv/helix/streams?${game_ids_param}&first=100`,
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
        <Listbox value={visibleStreamList} onChange={updateVisibleStreamList}>
          <ListboxButton className="flex justify-center items-center w-full p-4">
            {open ? (
              <div className="flex justify-between items-center w-full">
                <span className="uppercase font-bold text-sm">
                  {visibleStreamList == 'following'
                    ? 'Followed Channels'
                    : FOLLOWED_GAMES.find(
                        (fg) => fg.game_id.toString() == visibleStreamList
                      )?.game_title}
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
            anchor="bottom start"
            className="translate-x-4 z-10 rounded-lg ring-1 ring-twborder bg-sidepanel uppercase text-sm"
          >
            <ListboxOption value="following" className="listbox-option">
              Followed Channels
            </ListboxOption>
            {FOLLOWED_GAMES.map((fg, i) => (
              <ListboxOption
                key={i}
                value={fg.game_id}
                className="listbox-option"
              >
                {fg.game_title}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      </div>

      {visibleStreamList == 'following' ? (
        <ChannelSection
          accessToken={accessToken}
          type={SectionType.Following}
          open={open}
          watching={watching}
          streams={followingStreams}
          addWatching={addWatching}
          removeWatching={removeWatching}
        />
      ) : (
        <ChannelSection
          accessToken={accessToken}
          type={SectionType.Game}
          open={open}
          watching={watching}
          streams={gameStreams?.filter((gs) => gs.game_id == visibleStreamList)}
          addWatching={addWatching}
          removeWatching={removeWatching}
        />
      )}

      {notVisibleStreams && notVisibleStreams.length > 0 && (
        <ChannelSection
          accessToken={accessToken}
          type={SectionType.NotFollowing}
          headerText="Other Channels"
          headerIcon={<BrokenHeart />}
          open={open}
          watching={watching}
          streams={notVisibleStreams}
          addWatching={addWatching}
          removeWatching={removeWatching}
        />
      )}
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
  headerText?: string;
  headerIcon?: React.ReactNode;
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
      {headerText && headerIcon && (
        <div
          className={`flex basis-20 shrink-0 grow-0 max-w-full text-center items-center ${
            open ? 'justify-start' : 'justify-center'
          } px-4`}
        >
          <span
            className={`${!open ? 'hidden' : ''} uppercase font-bold text-sm`}
          >
            {headerText}
          </span>
          <div className={`${open ? 'hidden' : ''} h-8`}>{headerIcon}</div>
        </div>
      )}
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
  if (viewerCount >= 1000) {
    let rounded = Number.parseFloat((viewerCount / 1000).toFixed(1)).toString();
    return `${rounded}K`;
  }
  return viewerCount;
}

export default Channels;
