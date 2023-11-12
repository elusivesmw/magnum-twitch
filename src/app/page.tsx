import Following from "@/components/following";
import Player from "@/components/player";
import MultiChat from "@/components/chat";

export default function Home() {
  const channels = ["iamtheratio", "firstnamebutt", "yourboyrudy"];

  return (
    <main className="flex max-h-screen justify-between">
      <Following />
      <div className="flex flex-col h-screen basis-auto grow shrink">
        {channels.map((e, i) => (
          <Player channel={e} key={i} />
        ))}
      </div>
      <MultiChat channels={channels} />
    </main>
  );
}
