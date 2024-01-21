import { Stream } from '@/types/twitch';
import { createPortal } from 'react-dom';

export const FollowingPopup = ({ stream }: { stream: Stream | undefined }) => {
  if (!stream) return;
  let target = document.getElementById(`following-stream-${stream.user_login}`);
  let rect = target?.getBoundingClientRect();
  if (!rect) return;

  // detect when we are near the bottom
  const BOTTOM_PADDING = 10;
  let tooltipTop: number | 'auto' = rect.top;
  let tooltipBottom: number | 'auto' = 'auto';
  if (rect.bottom > window.innerHeight - BOTTOM_PADDING) {
    tooltipBottom = BOTTOM_PADDING;
    tooltipTop = 'auto';
  }

  return createPortal(
    <div
      className="absolute top-20 left-20 w-96 z-50 bg-sidepanel text-white px-4 py-2 rounded-xl"
      style={{
        top: tooltipTop,
        bottom: tooltipBottom,
        left: rect.x + rect.width + 15,
      }}
    >
      {stream.title}
    </div>,
    document.body
  );
};
