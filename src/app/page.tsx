"use client";
import Following from "@/components/following";
import Player from "@/components/player";
import Chat from "@/components/chat";
import { LeftArrow, RightArrow } from "@/components/icons";
import { useState } from "react";

export default function Home() {
  const channels = ["louisdoucet", "firstnamebutt"];

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
    <main className="flex max-h-screen justify-between">
      <Following />
      <div className="flex flex-col h-screen basis-auto grow shrink">
        {channels.map((e, i) => (
          <Player channel={e} key={i} />
        ))}
      </div>

      <div className="flex flex-col h-screen w-[350px]">
        <div className="flex h-[50px] flex-wrap bg-twitchbg border-b border-twitchborder text-twitchtext items-center justify-between">
          <div onClick={prev} className="h-[20px] px-1 cursor-pointer">
            <LeftArrow />
          </div>
          <span className="uppercase font-bold text-xs text-center">
            {channels[visibleIndex]}
          </span>
          <div onClick={next} className="h-[20px] px-1 cursor-pointer">
            <RightArrow />
          </div>
        </div>
        <div className="flex grow h-auto">
          {channels.map((e, i) => (
            <Chat channel={e} visible={i == visibleIndex} key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
