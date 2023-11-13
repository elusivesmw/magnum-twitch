'use client';

import React from 'react';

const channels = [
  'katun24',
  'barbarousking',
  'dawildgrim',
  'dunkorslam',
  'yourboyrudy',
  'caioskii',
  'stucat_',
  'stew_',
  'zapplex',
  'thabeast721',
];
const Following = ({
  addWatching,
}: {
  addWatching: (channel: string) => void;
}) => {
  return (
    <div className="flex flex-col flex-wrap bg-twitchbg w-[240px]">
      <div className="flex h-[50px] text-center items-center justify-center">
        <span className="uppercase font-bold text-xs">Followed Channels</span>
      </div>
      {channels.map((e, i) => (
        <div
          className="px-[10px] py-[5px] cursor-pointer hover:bg-twitchbghover"
          onClick={() => addWatching(e)}
        >
          <span className="h-[42px]" key={i}>
            {e}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Following;
