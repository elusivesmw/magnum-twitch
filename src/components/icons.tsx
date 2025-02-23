export const Twitch = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      overflow="visible"
      width="100%"
      height="100%"
      version="1.1"
      viewBox="0 0 40 40"
      x="0px"
      y="0px"
      className={className}
    >
      <g>
        <polygon
          points="13 8 8 13 8 31 14 31 14 36 19 31 23 31 32 22 32 8"
          className="fill-twpurple"
        ></polygon>
        <polygon
          points="26 25 30 21 30 10 14 10 14 25 18 25 18 29 22 25"
          className="fill-white"
        ></polygon>
        <g className="">
          <path
            d="M20,14 L22,14 L22,20 L20,20 L20,14 Z M27,14 L27,20 L25,20 L25,14 L27,14 Z"
            className="fill-twpurple"
          ></path>
        </g>
      </g>
    </svg>
  );
};

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
      width="100%"
      height="100%"
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
      width="100%"
      height="100%"
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

export const HollowHeart = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M9.171 4.171A4 4 0 0 0 6.343 3H6a4 4 0 0 0-4 4v.343a4 4 0 0 0 1.172 2.829L10 17l6.828-6.828A4 4 0 0 0 18 7.343V7a4 4 0 0 0-4-4h-.343a4 4 0 0 0-2.829 1.172L10 5l-.829-.829zm.829 10 5.414-5.414A2 2 0 0 0 16 7.343V7a2 2 0 0 0-2-2h-.343a2 2 0 0 0-1.414.586L10 7.828 7.757 5.586A2 2 0 0 0 6.343 5H6a2 2 0 0 0-2 2v.343a2 2 0 0 0 .586 1.414L10 14.172z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export const BrokenHeart = ({ className = '' }: { className?: string }) => {
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
        <path d="M9.188 4.188L9.17 4.17A4 4 0 006.343 3H6a4 4 0 00-4 4v.343a4 4 0 001.172 2.829l5.367 5.367L10.484 11H6.538l2.65-6.812z"></path>
        <path d="M10.154 16.846l6.674-6.674A4 4 0 0018 7.343V7a4 4 0 00-4-4h-.343a4 4 0 00-2.091.59L9.462 9h4.055l-3.363 7.846z"></path>
      </g>
    </svg>
  );
};
export const SolidHeart = ({ className = '' }: { className?: string }) => {
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
        <path
          fillRule="evenodd"
          d="M9.171 4.171A4 4 0 006.343 3H6a4 4 0 00-4 4v.343a4 4 0 001.172 2.829L10 17l6.828-6.828A4 4 0 0018 7.343V7a4 4 0 00-4-4h-.343a4 4 0 00-2.829 1.172L10 5l-.829-.829z"
          clipRule="evenodd"
        ></path>
      </g>
    </svg>
  );
};

export const Plus = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      aria-label="Add"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M9 11v5h2v-5h5V9h-5V4H9v5H4v2h5z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export const PopOut = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path d="M12 4h2.586L9.293 9.293l1.414 1.414L16 5.414V8h2V2h-6v2z"></path>
      <path d="M4 4h6v2H4v10h10v-6h2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"></path>
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
        fillRule="evenodd"
        d="M13.192 14.606a7 7 0 1 1 1.414-1.414l3.101 3.1-1.414 1.415-3.1-3.1zM14 9A5 5 0 1 1 4 9a5 5 0 0 1 10 0z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export const Grid = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path d="M9 4H2v5h7V4zm9 0h-7v5h7V4zM2 11h7v5H2v-5zm16 0h-7v5h7v-5z"></path>
    </svg>
  );
};

export const Carousel = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path d="M2 3h16v9H2V3zm9 11v3h7v-3h-7zm-9 0h7v3H2v-3z"></path>
    </svg>
  );
};

export const TrashCan = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      aria-label="Remove"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2H8v1H3v2h14V3h-5V2zM4 7v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7h-2v9H6V7H4z"></path>
      <path d="M11 7H9v7h2V7z"></path>
    </svg>
  );
};

export const Settings = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path d="M10 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"></path>
      <path
        fillRule="evenodd"
        d="M9 2h2a2.01 2.01 0 0 0 1.235 1.855l.53.22a2.01 2.01 0 0 0 2.185-.439l1.414 1.414a2.01 2.01 0 0 0-.439 2.185l.22.53A2.01 2.01 0 0 0 18 9v2a2.01 2.01 0 0 0-1.855 1.235l-.22.53a2.01 2.01 0 0 0 .44 2.185l-1.415 1.414a2.01 2.01 0 0 0-2.184-.439l-.531.22A2.01 2.01 0 0 0 11 18H9a2.01 2.01 0 0 0-1.235-1.854l-.53-.22a2.009 2.009 0 0 0-2.185.438L3.636 14.95a2.009 2.009 0 0 0 .438-2.184l-.22-.531A2.01 2.01 0 0 0 2 11V9c.809 0 1.545-.487 1.854-1.235l.22-.53a2.009 2.009 0 0 0-.438-2.185L5.05 3.636a2.01 2.01 0 0 0 2.185.438l.53-.22A2.01 2.01 0 0 0 9 2zm-4 8 1.464 3.536L10 15l3.535-1.464L15 10l-1.465-3.536L10 5 6.464 6.464 5 10z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export const External = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      aria-label="External link"
      fill="currentColor"
      className={className}
    >
      <path d="M6 8h5.293L5 14.293l1.414 1.414 6.293-6.293V15h2V6H6v2z"></path>
    </svg>
  );
};

export const LogOut = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      width="100%"
      height="100%"
      version="1.1"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <g>
        <path d="M16 18h-4a2 2 0 01-2-2v-2h2v2h4V4h-4v2h-2V4a2 2 0 012-2h4a2 2 0 012 2v12a2 2 0 01-2 2z"></path>
        <path d="M7 5l1.5 1.5L6 9h8v2H6l2.5 2.5L7 15l-5-5 5-5z"></path>
      </g>
    </svg>
  );
};
