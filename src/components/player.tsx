import { CloseX, ArrowDown, ArrowUp, Spotlight, PopOut } from './icons';

const EMBED_PARENT = process.env.NEXT_PUBLIC_TWITCH_EMBED_PARENT;

const Player = ({
  channel,
  order,
  total,
  isActiveChat,
  removeWatching,
  reorderWatching,
}: {
  channel: string;
  order: number;
  total: number;
  isActiveChat: boolean;
  removeWatching: (channel: string) => void;
  reorderWatching: (channel: string, index: number, relative: boolean) => void;
}) => {
  function popout(channel: string) {
    window.open(`https://www.twitch.tv/${channel}`, '_blank');
    removeWatching(channel);
  }

  return (
    <>
      <div
        id={`twitch-embed-${channel}`}
        className="twitch-player relative select-none group"
        data-pos={order + 1}
        data-of={total}
        style={{ order: order }}
      >
        <div className="absolute top-0 left-0 bottom-0 right-0 m-auto aspect-video max-w-full max-h-full">
          <div className="absolute top-1 right-1 hidden group-hover:block">
            <div className="flex gap-1">
              <div
                className="h-[20px] cursor-pointer rounded bg-black bg-opacity-50 z-10"
                onClick={() => reorderWatching(channel, 0, false)}
              >
                <Spotlight />
              </div>
              <div
                className="h-[20px] cursor-pointer rounded bg-black bg-opacity-50 z-10"
                onClick={() => reorderWatching(channel, -1, true)}
              >
                <ArrowUp />
              </div>
              <div
                className="h-[20px] cursor-pointer rounded bg-black bg-opacity-50 z-10"
                onClick={() => reorderWatching(channel, 1, true)}
              >
                <ArrowDown />
              </div>
              <div
                className="h-[20px] cursor-pointer rounded bg-black bg-opacity-50 z-10 ml-8"
                onClick={() => popout(channel)}
              >
                <PopOut />
              </div>
              <div
                className="h-[20px] cursor-pointer rounded bg-black bg-opacity-50 z-10"
                onClick={() => removeWatching(channel)}
              >
                <CloseX />
              </div>
            </div>
          </div>
          <iframe
            className={`w-full h-full border-[3px] ${
              isActiveChat && total > 1 ? 'border-twpurple' : 'border-black'
            }`}
            src={`https://player.twitch.tv/?channel=${channel}&parent=${EMBED_PARENT}`}
            height="720"
            width="1280"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default Player;
