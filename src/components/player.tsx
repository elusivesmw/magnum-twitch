import { CloseX, ArrowDown, ArrowUp, Spotlight } from './icons';
import { AnimationEvent } from 'react';

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
  reorderWatching: (channel: string, index: number, relative: boolean) => void;
}) => {
  return (
    <>
      <div
        id={`twitch-embed-${channel}`}
        className="twitch-player relative aspect-video select-none group border-[2px] border-black animate-highlight"
        onAnimationEnd={stopAnimation}
        data-pos={`${order+1}/${total}`}
        style={{ order: order }}
      >
        <div className="absolute top-1 right-1 hidden group-hover:block">
          <div className="flex gap-1">
            <div
              className="h-[20px] cursor-pointer rounded bg-black bg-opacity-50"
              onClick={() => reorderWatching(channel, 0, false)}
            >
              <Spotlight />
            </div>
            <div
              className="h-[20px] cursor-pointer rounded bg-black bg-opacity-50"
              onClick={() => reorderWatching(channel, -1, true)}
            >
              <ArrowUp />
            </div>
            <div
              className="h-[20px] cursor-pointer rounded bg-black bg-opacity-50"
              onClick={() => reorderWatching(channel, 1, true)}
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

function stopAnimation(e: AnimationEvent) {
  let target = e.target as HTMLElement;
  target.classList.remove('animate-highlight');
}

export default Player;
