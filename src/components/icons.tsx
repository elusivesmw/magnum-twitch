export const LeftArrow = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      width="100%"
      height="100%"
      version="1.1"
      viewBox="0 0 20 20"
      x="0px"
      y="0px"
      fill="currentColor"
      className={className}
    >
      <g>
        <path d="M13.5 14.5L9 10l4.5-4.5L12 4l-6 6 6 6 1.5-1.5z"></path>
      </g>
    </svg>
  );
};

export const RightArrow = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      width="100%"
      height="100%"
      version="1.1"
      viewBox="0 0 20 20"
      x="0px"
      y="0px"
      fill="currentColor"
      className={className}
    >
      <g>
        <path d="M6.5 5.5L11 10l-4.5 4.5L8 16l6-6-6-6-1.5 1.5z"></path>
      </g>
    </svg>
  );
};

export const CloseX = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path d="M8.5 10 4 5.5 5.5 4 10 8.5 14.5 4 16 5.5 11.5 10l4.5 4.5-1.5 1.5-4.5-4.5L5.5 16 4 14.5 8.5 10z"></path>
    </svg>
  );
};
