import Script from "next/script";

const Player = ({ channel }: { channel: string }) => {
  return (
    <>
      <div id={`twitch-embed-${channel}`} className="h-full w-full">
        <iframe
          className="max-w-full w-full h-full"
          src={`https://player.twitch.tv/?channel=${channel}&parent=localhost`}
          height="720"
          width="1280"
          allowFullScreen
        ></iframe>
      </div>
    </>
  );
};

export default Player;
