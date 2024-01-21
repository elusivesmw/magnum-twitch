import { createPortal } from 'react-dom';

export const FollowingPopup = ({ stream }: { stream: string }) => {
  let target = document.getElementById(`following-stream-${stream}`);
  let rect = target?.getBoundingClientRect();
  if (!rect) return;
  console.log(rect);
  return createPortal(
    <div
      className="absolute top-20 left-20 z-50 bg-red-500 text-black p-2"
      style={{ top: rect.top, left: rect.x + rect.width + 20 }}
    >
      portal
    </div>,
    document.body
  );
};
