import { CloseX, Spotlight } from './icons';

const Player = ({
  channel,
  removeWatching,
  reorderWatching,
}: {
  channel: string;
  removeWatching: (channel: string) => void;
  reorderWatching: (channel: string) => void;
}) => {
  return (
    <>
      <div
        id={`twitch-embed-${channel}`}
        className="relative aspect-video select-none group"
      >
        <div className="absolute top-1 right-1 hidden group-hover:block">
          <div className="flex">
            <div
              className="h-[20px] cursor-pointer"
              onClick={() => reorderWatching(channel)}
            >
              <Spotlight />
            </div>
            <div
              className="h-[20px] cursor-pointer ml-2"
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
