import { CloseX, DownArrow, UpArrow } from './icons';

const Player = ({
  channel,
  order,
  removeWatching,
  reorderWatching,
}: {
  channel: string;
  order: number;
  removeWatching: (channel: string) => void;
  reorderWatching: (channel: string, rel: number) => void;
}) => {
  return (
    <>
      <div
        id={`twitch-embed-${channel}`}
        className="relative aspect-video select-none group"
        style={{ order: order }}
      >
        <div className="absolute top-1 right-1 hidden group-hover:block">
          <div className="flex gap-1">
            <div
              className="h-[20px] cursor-pointer rounded bg-black bg-opacity-50"
              onClick={() => reorderWatching(channel, -1)}
            >
              <UpArrow />
            </div>
            <div
              className="h-[20px] cursor-pointer rounded bg-black bg-opacity-50"
              onClick={() => reorderWatching(channel, 1)}
            >
              <DownArrow />
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
          src={`https://player.twitch.tv/?channel=${channel}&parent=localhost`}
          height="720"
          width="1280"
          allowFullScreen
        ></iframe>
      </div>
    </>
  );
};

export default Player;
