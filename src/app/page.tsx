'use client';

import Following from '@/components/following';
import Player from '@/components/player';
import MultiChat from '@/components/chat';
import { useEffect, useState } from 'react';
import { User } from '@/types/twitch';

const TWITCH_CLIENT_ID = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Home() {
  const [watching, setWatching] = useState([] as string[]);
  const [activeChat, setActiveChat] = useState(0);
  const [order, setOrder] = useState([] as string[]);

  const [accessToken, setAccessToken] = useState(null);
  useEffect(() => {
    let hash = getHashValues();
    let token = hash.access_token;
    if (!token) return;
    setAccessToken(token);
  }, []);

  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    updateUser();
  }, [accessToken]);

  const addWatching = (channel: string) => {
    if (watching.includes(channel)) return;
    setWatching([...watching, channel]);
    setOrder([...order, channel]);

    if (watching.length < 1) {
      setActiveChat(0);
    }
  };

  const removeWatching = (channel: string) => {
    let watchingIndex = watching.findIndex((c) => c == channel);
    if (watchingIndex < 0) return;
    // remove player
    setWatching(watching.filter((_, i) => i != watchingIndex));
    // update order
    setOrder(order.filter((o) => o != channel));

    // set active chat
    if (watchingIndex >= watching.length - 1) {
      watchingIndex--;
    }
    setActiveChat(watchingIndex);
  };

  const reorderWatching = (channel: string, rel: number) => {
    let fromOrder = order.findIndex((o) => o == channel);
    let toOrder = fromOrder + rel;
    if (toOrder < 0 || toOrder > watching.length + 1) return;
    // move channel to index 0
    let newOrder = [...order];
    move(newOrder, fromOrder, toOrder);
    setOrder(newOrder);
  };

  const updateUser = () => {
    if (!accessToken) return;
    const httpOptions: Object = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Client-Id': TWITCH_CLIENT_ID,
      },
    };
    fetch('https://api.twitch.tv/helix/users', httpOptions)
      .then((res) => res.json())
      .then((json) => {
        let users = json.data as User[];
        if (users.length != 1) return;
        setUser(users[0]);
      });
  };

  return (
    <main className="flex flex-col h-screen">
      <header className="flex h-20 grow-0 shrink-0 bg-chatpanel z-20 header-shadow justify-between">
        <div className="flex p-4">
          <span className="flex self-center p-4 text-xl font-bold">T</span>
          <span className="">active chat: {activeChat}</span>
        </div>
        <div className="flex p-4">
        {user && (
          <div className="w-[30px]">
            <img src={user.profile_image_url} className="w-full max-w-full rounded-full object-cover" />
          </div>
        )}
        {!accessToken && (
          <a
            href={`https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${TWITCH_CLIENT_ID}&redirect_uri=${BASE_URL}&scope=user:read:follows`}
            className="inline-flex items-center text-sm font-semibold px-4 text-twbuttontext bg-twbuttonbg bg-opacity-[0.38] hover:bg-opacity-[0.48] rounded-[4px]"
          >
            Log In
          </a>
        )}
        </div>
      </header>
      <div className="relative h-full">
        <div className="absolute w-full h-full">
          <div className="flex h-full">
            <Following accessToken={accessToken} addWatching={addWatching} />
            <div className="flex flex-col basis-auto grow shrink bg-noplayer">
              {watching.map((e, i) => (
                <Player
                  channel={e}
                  order={order.findIndex((o) => o == e)}
                  reorderWatching={reorderWatching}
                  removeWatching={removeWatching}
                  key={i}
                />
              ))}
            </div>
            <MultiChat
              channels={watching}
              activeChat={activeChat}
              updateActiveChat={setActiveChat}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function move(order: string[], from: number, to: number) {
  order.splice(to, 0, order.splice(from, 1)[0]);
}

const getHashValues = () => {
  let hash = document.location.hash.substr(1);
  var params: any = {};
  hash.split('&').map((hashkey) => {
    let temp = hashkey.split('=');
    params[temp[0]] = temp[1];
  });
  console.log(params);
  return params;
};

