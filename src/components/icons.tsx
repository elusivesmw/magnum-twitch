export const ArrowLeft = ({ className = '' }: { className?: string }) => {
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

export const ArrowRight = ({ className = '' }: { className?: string }) => {
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

export const ArrowUp = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      width="2rem"
      height="2rem"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path d="M7.5 12.5 10 10l2.5 2.5L14 11l-4-4-4 4 1.5 1.5z"></path>
    </svg>
  );
};

export const ArrowDown = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      width="2rem"
      height="2rem"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path d="M12.5 7.5 10 10 7.5 7.5 6 9l4 4 4-4-1.5-1.5z"></path>
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

export const CollapseLeft = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <g>
        <path d="M16 16V4h2v12h-2zM6 9l2.501-2.5-1.5-1.5-5 5 5 5 1.5-1.5-2.5-2.5h8V9H6z"></path>
      </g>
    </svg>
  );
};

export const CollapseRight = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <g>
        <path d="M4 16V4H2v12h2zM13 15l-1.5-1.5L14 11H6V9h8l-2.5-2.5L13 5l5 5-5 5z"></path>
      </g>
    </svg>
  );
};

export const Spotlight = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fill-rule="evenodd"
        d="M13.192 14.606a7 7 0 1 1 1.414-1.414l3.101 3.1-1.414 1.415-3.1-3.1zM14 9A5 5 0 1 1 4 9a5 5 0 0 1 10 0z"
        clip-rule="evenodd"
      ></path>
    </svg>
  );
};
