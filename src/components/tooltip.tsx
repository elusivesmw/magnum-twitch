import { SectionType } from '@/types/channel';
import { Stream } from '@/types/twitch';
import Image from 'next/image';
import { createPortal } from 'react-dom';

export const FollowingTooltip = ({
  type,
  stream,
  open,
}: {
  type: SectionType;
  stream: Stream | undefined;
  open: boolean;
}) => {
  if (!stream) return;
  let target = document.getElementById(
    `following-${type}-${stream.user_login}`
  );
  let rect = target?.getBoundingClientRect();
  if (!rect) return;

  // TODO: give option to not display image
  const IMAGE_WIDTH = 220;
  const IMAGE_HEIGHT = 124;

  // TODO: figure out stream title height a more accurate way,
  // rather than just accounting for the usual max.
  const STREAM_TITLE_HEIGHT = 63; // 3 lines-ish of text

  // detect when we are near the bottom
  const BOTTOM_PADDING = 10;
  let tooltipTop: number | 'auto' = rect.top;
  let tooltipBottom: number | 'auto' = 'auto';
  if (
    rect.bottom >
    window.innerHeight - BOTTOM_PADDING - IMAGE_HEIGHT - STREAM_TITLE_HEIGHT
  ) {
    tooltipBottom = BOTTOM_PADDING;
    tooltipTop = 'auto';
  }

  let streamThumbnail = stream.thumbnail_url
    .replace('{width}', IMAGE_WIDTH.toString())
    .replace('{height}', IMAGE_HEIGHT.toString());

  return createPortal(
    <div
      className="absolute top-20 left-20 w-96 z-50 bg-sidepanel text-white px-4 pt-2 pb-4 rounded-xl"
      style={{
        top: tooltipTop,
        bottom: tooltipBottom,
        left: rect.x + rect.width + 15,
      }}
    >
      {!open && (
        <>
          <div className="text-[#dedee3] text-base font-semibold leading-tight truncate">
            {stream.user_name}
          </div>
          <div className="text-sm text-twfadedtext leading-tight truncate mb-2">
            {stream.game_name}
          </div>
        </>
      )}
      <span className="block mb-2">{stream.title}</span>
      <Image
        src={streamThumbnail}
        width={IMAGE_WIDTH}
        height={IMAGE_HEIGHT}
        alt={`${stream.user_name} stream thumbnail`}
        unoptimized
      />
    </div>,
    document.body
  );
};
