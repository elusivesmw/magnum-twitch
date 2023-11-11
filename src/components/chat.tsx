const Chat = ({ channel, visible }: { channel: string; visible: boolean }) => {
  return (
    <div className={`${visible ? "block" : "hidden"}`}>
      <iframe
        className="relative h-full"
        id={`twitch-chat-embed-${channel}`}
        src={`https://www.twitch.tv/embed/${channel}/chat?parent=localhost`}
        height="1200"
        width="350"
      ></iframe>
    </div>
  );
};

export default Chat;
