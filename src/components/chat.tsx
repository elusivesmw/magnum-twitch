const Chat = ({ channel }: { channel: string }) => {
  return (
    <div className="h-[100vh] w-[350px]">
      <iframe
        className="absolute top-0 bottom-0 h-full"
        id={`twitch-chat-embed-${channel}`}
        src={`https://www.twitch.tv/embed/${channel}/chat?parent=localhost`}
        height="1200"
        width="350"
      ></iframe>
    </div>
  );
};

export default Chat;
