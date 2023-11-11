import Following from "@/components/following";
import Player from "@/components/player";
import Chat from "@/components/chat";

export default function Home() {
  const channels = ["katun24", "babayegha"];
  const visibleIndex = 0;
  return (
    <main className="flex max-h-screen justify-between">
      <Following />
      <div className="flex flex-col h-screen basis-auto grow shrink">
        {channels.map((e, i) => (
          <Player channel={e} key={i} />
        ))}
      </div>

      <div className="flex flex-col h-screen w-[350px]">
        <div className="h-[50px] bg-twitchbg border-b border-twitchborder uppercase font-bold text-xs text-center text-twitchtext py-4">
          {channels[visibleIndex]}
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
