import { CloseX } from './icons';

const Player = ({
  channel,
  removeWatching,
}: {
  channel: string;
  removeWatching: (channel: string) => void;
}) => {
  return (
    <>
      <div
        id={`twitch-embed-${channel}`}
        className="relative h-full w-full select-none group"
      >
        <div
          className="absolute h-[20px] top-1 right-1 cursor-pointer hidden group-hover:block"
          onClick={() => removeWatching(channel)}
        >
          <CloseX />
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
