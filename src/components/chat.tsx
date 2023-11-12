"use client";

import { useState } from "react";
import { LeftArrow, RightArrow } from "@/components/icons";

const MultiChat = ({ channels }: { channels: string[] }) => {
  const [visibleIndex, setVisibleIndex] = useState(0);

  const next = () => {
    console.log("next");
    var i = visibleIndex + 1;
    if (i > channels.length - 1) i = 0;
    setVisibleIndex(i);
  };

  const prev = () => {
    console.log("prev");
    var i = visibleIndex - 1;
    if (i < 0) i = channels.length - 1;
    setVisibleIndex(i);
  };

  return (
    <div className="flex flex-col h-screen w-[350px]">
      <div className="flex h-[50px] flex-wrap bg-twitchbg border-b border-twitchborder text-twitchtext items-center justify-between">
        <div
          onClick={prev}
          className="h-[20px] px-1 cursor-pointer select-none"
        >
          <LeftArrow />
        </div>
        <span className="uppercase font-bold text-xs text-center">
          {channels[visibleIndex]}
        </span>
        <div
          onClick={next}
          className="h-[20px] px-1 cursor-pointer select-none"
        >
          <RightArrow />
        </div>
      </div>
      <div className="flex grow h-auto">
        {channels.map((e, i) => (
          <Chat channel={e} visible={i == visibleIndex} key={i} />
        ))}
      </div>
    </div>
  );
};

const Chat = ({ channel, visible }: { channel: string; visible: boolean }) => {
  return (
    <div className={`${visible ? "block" : "hidden"}`}>
      <iframe
        className="relative h-full"
        id={`twitch-chat-embed-${channel}`}
        src={`https://www.twitch.tv/embed/${channel}/chat?parent=localhost`}
        height="1200"
        width="350"
      ></iframe>
    </div>
  );
};

export default MultiChat;
