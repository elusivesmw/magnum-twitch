import { createPortal } from 'react-dom';

export const FollowingPopup = ({ show }: { show: boolean }) => {
  if (show) {
    return createPortal(<div>portal</div>, document.body);
  }
  return <></>;
};
