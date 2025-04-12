import { useCallback, useEffect } from 'react';

/**
 * Hook to provide additional methods to watching, order, and active chat states.
 */
export function useWatchingManager(
  watching: string[],
  setWatching: React.Dispatch<React.SetStateAction<string[]>>,
  order: string[],
  setOrder: React.Dispatch<React.SetStateAction<string[]>>,
  activeChat: string,
  setActiveChat: (chat: string) => void
): {
  addWatching: (channel: string) => void;
  removeWatching: (channel: string) => void;
  reorderWatching: (channel: string, index: number, relative: boolean) => void;
} {
  // update active chat if removed
  useEffect(() => {
    let found = watching.find((e) => e == activeChat);
    if (!found) {
      setActiveChat(watching[0]);
    }
  }, [watching, activeChat, setActiveChat]);

  // add channel to watching state
  function addWatching(channel: string) {
    if (watching.includes(channel)) {
      // add highlight animation
      let channelDiv = document.getElementById(`twitch-embed-${channel}`);
      if (!channelDiv) return;
      channelDiv.classList.add('animate-highlight');
      return;
    }

    if (watching.length >= 9) {
      // do this better :]
      alert("That's enough, dude.");
      return;
    }

    // add player
    setWatching([...watching, channel]);
    setOrder([...order, channel]);

    if (watching.length < 1) {
      setActiveChat(watching[0]);
    }
  }

  // remove channel from watching state
  const removeWatching = useCallback(
    (channel: string) => {
      if (!watching.find((e) => e == channel)) return;

      // remove player
      setWatching((w: string[]) => w.filter((e: string) => e != channel));
      setOrder((o) => o.filter((e) => e != channel));
    },
    [watching, setWatching, setOrder]
  );

  // reorder channel in order state
  function reorderWatching(channel: string, index: number, relative: boolean) {
    console.log('watching in reorder', watching);
    let fromOrder = order.findIndex((o) => o == channel);
    let toOrder = relative ? fromOrder + index : index;
    if (toOrder < 0 || toOrder > watching.length + 1) return;

    // set active chat on goto first
    if (!relative && toOrder == 0) {
      setActiveChat(channel);
    }

    // move channel to index 0
    let newOrder = [...order];
    move(newOrder, fromOrder, toOrder);
    setOrder(newOrder);
  }

  return { addWatching, removeWatching, reorderWatching };
}

function move(order: string[], from: number, to: number) {
  order.splice(to, 0, order.splice(from, 1)[0]);
}
