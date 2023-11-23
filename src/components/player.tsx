import { CloseX, ArrowDown, ArrowUp } from './icons';

const EMBED_PARENT = process.env.NEXT_PUBLIC_TWITCH_EMBED_PARENT;

const Player = ({
  channel,
  order,
  total,
  removeWatching,
  reorderWatching,
}: {
  channel: string;
  order: number;
  total: number;
  removeWatching: (channel: string) => void;
  reorderWatching: (channel: string, rel: number) => void;
}) => {
  return (
    <>
      <div
        id={`twitch-embed-${channel}`}
        className="twitch-player relative aspect-video select-none group"
        data-pos={`${order+1}/${total}`}
        style={{ order: order }}
      >
        <div className="absolute top-1 right-1 hidden group-hover:block">
          <div className="flex gap-1">
            <div
              className="h-[20px] cursor-pointer rounded bg-black bg-opacity-50"
              onClick={() => reorderWatching(channel, -1)}
            >
              <ArrowUp />
            </div>
            <div
              className="h-[20px] cursor-pointer rounded bg-black bg-opacity-50"
              onClick={() => reorderWatching(channel, 1)}
            >
              <ArrowDown />
            </div>

            <div
              className="h-[20px] cursor-pointer rounded bg-black bg-opacity-50"
              onClick={() => removeWatching(channel)}
            >
              <CloseX />
            </div>
          </div>
        </div>
        <iframe
          className="max-w-full w-full h-full"
          src={`https://player.twitch.tv/?channel=${channel}&parent=${EMBED_PARENT}`}
          height="720"
          width="1280"
          allowFullScreen
        ></iframe>
      </div>
    </>
  );
};

export default Player;
