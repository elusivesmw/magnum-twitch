import Script from "next/script";
import Player from "@/components/player";
import Chat from "@/components/chat";

export default function Home() {
  const channel = "dunkorslam";
  return (
    <main className="flex min-h-screen items-center justify-between">
      <Player channel={channel} />
      <Chat channel={channel} />
    </main>
  );
}
