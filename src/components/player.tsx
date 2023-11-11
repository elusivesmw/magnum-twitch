import Script from "next/script";

const Player = ({ channel }: { channel: string }) => {
  return (
    <>
      <div className="">
        <div id={`twitch-embed-${channel}`}></div>
      </div>

      <Script src="https://embed.twitch.tv/embed/v1.js"></Script>
      <Script>
        {`
                  var embed = new Twitch.Embed("twitch-embed-${channel}", {
                    width: 1200,
                    height: 720,
                    channel: "${channel}",
                    layout: "video",
                    autoplay: true,
                  });

                  embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
                    var player = embed.getPlayer();
                    player.play();
                  });
                `}
      </Script>
    </>
  );
};

export default Player;
