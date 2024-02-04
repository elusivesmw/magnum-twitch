'use client';

import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CollapseLeft,
  CollapseRight,
} from '@/components/icons';

const EMBED_PARENT = process.env.NEXT_PUBLIC_TWITCH_EMBED_PARENT;

const MultiChat = ({
  channels,
  activeChat,
  updateActiveChat,
}: {
  channels: string[];
  activeChat: string;
  updateActiveChat: (chat: string) => void;
}) => {
  const [visibleIndex, setVisibleIndex] = useState(0);

  useEffect(() => {
    setVisibleIndex(channels.findIndex((e) => e == activeChat));
  }, [activeChat]);

  const next = () => {
    var i = visibleIndex + 1;
    if (i > channels.length - 1) i = 0;
    setVisibleIndex(i);
    updateActiveChat(channels[i]);
  };

  const prev = () => {
    var i = visibleIndex - 1;
    if (i < 0) i = channels.length - 1;
    setVisibleIndex(i);
    updateActiveChat(channels[i]);
  };

  let [open, setOpen] = useState<boolean>(true);
  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <div className={`flex flex-col h-full ${open ? 'w-[350px]' : 'w-auto'}`}>
      <div className="relative flex h-[50px] flex-wrap bg-chatpanel border-b border-twborder text-twtext items-center justify-between">
        <div
          onClick={prev}
          className={`${
            open ? 'block' : 'hidden'
          } h-[20px] px-2 cursor-pointer select-none hover:bg-twbuttonbg hover:bg-opacity-[0.48]`}
        >
          <ArrowLeft />
        </div>
        <span
          className={`${
            open ? 'block' : 'hidden'
          } uppercase font-bold text-sm text-center`}
        >
          {activeChat}
        </span>
        <div
          onClick={next}
          className={`${
            open ? 'block' : 'hidden'
          } h-[20px] px-2 cursor-pointer select-none hover:bg-twbuttonbg hover:bg-opacity-[0.48]`}
        >
          <ArrowRight />
        </div>
        <div
          className={`${
            open ? 'left-2' : 'left-[-30px]'
          } absolute bottom-[-3em] z-10`}
        >
          <button
            onClick={toggleOpen}
            className="inline-flex h-[30px] p-2 hover:bg-twbuttonbg hover:bg-opacity-[0.48] rounded-[4px]"
          >
            {open ? <CollapseRight /> : <CollapseLeft />}
          </button>
        </div>
      </div>
      <div className={`${open ? 'block' : 'hidden'} flex grow h-auto`}>
        {channels.map((e) => (
          <Chat channel={e} visible={e == activeChat} key={`chat-key-${e}`} />
        ))}
      </div>
    </div>
  );
};

const Chat = ({ channel, visible }: { channel: string; visible: boolean }) => {
  return (
    <div className={`${visible ? 'block' : 'hidden'}`}>
      <iframe
        className="relative h-full"
        id={`twitch-chat-embed-${channel}`}
        src={`https://www.twitch.tv/embed/${channel}/chat?parent=${EMBED_PARENT}&darkpopout`}
        height="1200"
        width="350"
      ></iframe>
    </div>
  );
};

export default MultiChat;
