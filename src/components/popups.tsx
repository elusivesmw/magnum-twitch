import { Stream } from '@/types/twitch';
import Image from 'next/image';
import { createPortal } from 'react-dom';

export const FollowingPopup = ({ stream }: { stream: Stream | undefined }) => {
  if (!stream) return;
  let target = document.getElementById(`following-stream-${stream.user_login}`);
  let rect = target?.getBoundingClientRect();
  if (!rect) return;

  //TODO: give option to not display image
  const IMAGE_WIDTH = 220;
  const IMAGE_HEIGHT = 124;

  // detect when we are near the bottom
  const BOTTOM_PADDING = 10;
  let tooltipTop: number | 'auto' = rect.top;
  let tooltipBottom: number | 'auto' = 'auto';
  if (rect.bottom > window.innerHeight - BOTTOM_PADDING - IMAGE_HEIGHT) {
    tooltipBottom = BOTTOM_PADDING;
    tooltipTop = 'auto';
  }

  let streamThumbnail = stream.thumbnail_url
    .replace('{width}', IMAGE_WIDTH.toString())
    .replace('{height}', IMAGE_HEIGHT.toString());

  return createPortal(
    <div
      className="absolute top-20 left-20 w-96 z-50 bg-sidepanel text-white px-4 py-2 rounded-xl"
      style={{
        top: tooltipTop,
        bottom: tooltipBottom,
        left: rect.x + rect.width + 15,
      }}
    >
      <span className="block mb-2">{stream.title}</span>
      <Image
        src={streamThumbnail}
        width={IMAGE_WIDTH}
        height={IMAGE_HEIGHT}
        alt=""
      />
    </div>,
    document.body
  );
};
