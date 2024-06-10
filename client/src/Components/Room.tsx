import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ChatMessage, QueueVideoInfo, RoomState, UserInfo, VideoPlayerState } from "../types";
import Chat from "./Chat";
import VideoPlayer from "./VideoPlayer";
import "../styles/Room.css";
import VideoSearch from "./VideoSearch";
import VideoQueue from "./VideoQueue";
import ContentTabs from "./ContentTabs";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Tooltip, IconButton } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import MoviesSearch from "./MoviesSearch";

interface RoomProps {
  roomCode: string;
  userId: string;
  name: string;
}

export default function Room(props: RoomProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [toolTipText, setToolTipText] = useState("Copy to clipboard");
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
    skipVotes: [],
    loading: false,
  });

  const isBigScreen = useMediaQuery({ query: "(min-width: 950px)" });

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

  const addToQueue = (video: QueueVideoInfo) => {
    if (!video.url) return;
    const user: UserInfo = { name: props.name, id: props.userId, color: "", avatar: "" };
    activeSocket?.emit("addToQueue", { user, video });
  };

  const handleVideoEnd = () => {
    activeSocket?.emit("endVideo", { videoId: videoState.currentVideoId });
  };

  const handleVoteSkip = () => {
    activeSocket?.emit("voteSkip");
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

  const handleCopyClick = () => {
    navigator.clipboard.writeText(`https://loungespot.netlify.app/join/${props.roomCode}`);
    setToolTipText("Copied ✅");
  };

  const resetTooltip = () => {
    setTimeout(() => {
      setToolTipText("Copy to clipboard");
    }, 200);
  };

  if (isConnected)
    return (
      <>
        {isBigScreen ? (
          <h1 id="room-header">
            Lounge: {props.roomCode}{" "}
            <span onMouseLeave={resetTooltip}>
              <Tooltip title={toolTipText} arrow color="success">
                <IconButton color="secondary" id="copy-button" size="large" onClick={handleCopyClick}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </span>
          </h1>
        ) : null}

        <div id={isBigScreen ? "room-wrapper" : "room-wrapper-small"}>
          <div id="video-player-wrapper">
            <VideoPlayer
              handlePauseVideo={pauseVideo}
              handlePlayVideo={playVideo}
              videoState={videoState}
              addToQueue={addToQueue}
              onVideoEnd={handleVideoEnd}
              handleVoteSkip={handleVoteSkip}
              members={members}
            />
            {isBigScreen ? (
              <ContentTabs headers={["Queue", "Search", "Movies/TV"]}>
                <VideoQueue queue={videoState.queue} />
                <VideoSearch handleRequestVideo={addToQueue} />
                <MoviesSearch handleRequestMovie={addToQueue} />
              </ContentTabs>
            ) : (
              <ContentTabs headers={["Chat", "Queue", "Search", "Movies/TV"]}>
                <Chat messages={messages} handleSendMessage={sendMessage} roomCode={props.roomCode} />
                <VideoQueue queue={videoState.queue} />
                <VideoSearch handleRequestVideo={addToQueue} />
                <MoviesSearch handleRequestMovie={addToQueue} />
              </ContentTabs>
            )}
          </div>
          {isBigScreen ? (
            <div id="chat-wrapper">
              <Chat messages={messages} handleSendMessage={sendMessage} roomCode={props.roomCode} />
            </div>
          ) : null}
        </div>
      </>
    );
}
