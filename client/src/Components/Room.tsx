import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ChatMessage, RoomState, UserInfo, VideoPlayerState } from "../types";
import Chat from "./Chat";
import VideoPlayer from "./VideoPlayer";
import "../styles/Room.css";

interface RoomProps {
  roomCode: string;
  userId: string;
  name: string;
}

export default function Room(props: RoomProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [members, setMembers] = useState<{ [id: string]: UserInfo }>({});
  const [activeSocket, setActiveSocket] = useState<Socket | null>(null);
  const [videoState, setVideoState] = useState<VideoPlayerState>({
    url: "",
    currentTime: 0,
    playing: false,
    maxTime: 0,
    startTimeStamp: 0,
    pauseTimeStamp: 0,
    playPauseOffset: 0,
    queue: [],
    currentVideoId: "",
  });

  const sendMessage = (message: string) => {
    const user: UserInfo = { name: props.name, id: props.userId, color: "", avatar: "" };
    activeSocket?.emit("sendMessage", { user, message });
  };

  const playVideo = () => {
    activeSocket?.emit("startVideo");
  };
  const pauseVideo = () => {
    activeSocket?.emit("stopVideo");
  };

  const addToQueue = (url: string) => {
    const user: UserInfo = { name: props.name, id: props.userId, color: "", avatar: "" };
    activeSocket?.emit("addToQueue", { user, url });
  };

  const handleVideoEnd = () => {
    activeSocket?.emit("endVideo", { videoId: videoState.currentVideoId });
  };

  useEffect(() => {
    const url = import.meta.env.VITE_SERVER_URL;
    const socket = io(url, {
      extraHeaders: {
        "Room-Code": props.roomCode,
        "User-Id": props.userId,
        "User-Name": props.name,
      },
    });
    setActiveSocket(socket);

    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("establishConnection", (data: RoomState) => {
      console.log(data);
      setMessages(data.messages);
      setMembers(data.members);
      setVideoState(data.videoInfo);
    });

    socket.on("updateVideoInfo", (data: VideoPlayerState) => {
      setVideoState(data);
    });

    socket.on("receiveMessage", (data: ChatMessage[]) => {
      setMessages(data);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  if (isConnected)
    return (
      <>
        <h1>ROOM: {props.roomCode}</h1>
        <div id="room-wrapper">
          <div id="video-player-wrapper">
            <VideoPlayer
              handlePauseVideo={pauseVideo}
              handlePlayVideo={playVideo}
              videoState={videoState}
              addToQueue={addToQueue}
              onVideoEnd={handleVideoEnd}
            />
          </div>
          <div id="chat-wrapper">
            <Chat messages={messages} handleSendMessage={sendMessage} roomCode={props.roomCode} />
          </div>
        </div>
      </>
    );
}
