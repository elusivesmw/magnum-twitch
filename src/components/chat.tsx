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
  setActiveChat,
}: {
  channels: string[];
  activeChat: string;
  setActiveChat: (chat: string) => void;
}) => {
  const [visibleIndex, setVisibleIndex] = useState(0);

  useEffect(() => {
    setVisibleIndex(channels.findIndex((e) => e == activeChat));
  }, [activeChat, channels]);

  const next = () => {
    var i = visibleIndex + 1;
    if (i > channels.length - 1) i = 0;
    setVisibleIndex(i);
    setActiveChat(channels[i]);
  };

  const prev = () => {
    var i = visibleIndex - 1;
    if (i < 0) i = channels.length - 1;
    setVisibleIndex(i);
    setActiveChat(channels[i]);
  };

  const dropdownSelected = (chat: string) => {
    setVisibleIndex(channels.findIndex((e) => e == chat));
    setActiveChat(chat);
  };

  let [open, setOpen] = useState<boolean>(true);
  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <div className={`flex flex-col h-full ${open ? 'w-[350px]' : 'w-auto'}`}>
      <div className="relative flex h-[50px] flex-wrap bg-chatpanel border-b border-twborder text-twtext items-center justify-between">
        <div
          className={`${!open ? 'absolute left-[-30px] top-4 z-10' : 'ml-2'} `}
        >
          <button
            onClick={toggleOpen}
            className="inline-flex h-[30px] p-2 hover:bg-twbuttonbg hover:bg-opacity-[0.48] rounded-[4px]"
          >
            {open ? <CollapseRight /> : <CollapseLeft />}
          </button>
        </div>
        <div className={`${open ? 'block' : 'hidden'}`}>
          <ChatDropdown
            channels={channels}
            activeChat={activeChat}
            setActiveChat={dropdownSelected}
          />
        </div>
        <div
          onClick={next}
          className={`${
            open ? 'block' : 'hidden'
          } h-[20px] px-2 cursor-pointer select-none hover:bg-twbuttonbg hover:bg-opacity-[0.48]`}
        >
          <ArrowRight />
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

const ChatDropdown = ({
  channels,
  activeChat,
  setActiveChat,
}: {
  channels: string[];
  activeChat: string;
  setActiveChat: (chat: string) => void;
}) => {
  if (channels.length > 0) {
    return (
      <select
        className="uppercase font-bold text-sm text-center bg-chatpanel"
        onChange={(e) => setActiveChat(e.target.value)}
      >
        {channels.map((e, i) => (
          <option value={e} selected={e == activeChat} key={i}>
            {e}
          </option>
        ))}
      </select>
    );
  } else {
    return (
      <span className="uppercase font-bold text-sm text-center">
        No Channels
      </span>
    );
  }
};

export default MultiChat;
