import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ChatMessage, RoomState, UserInfo } from "../types";
import Chat from "./Chat";

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

  const sendMessage = (message: string) => {
    const user: UserInfo = { name: props.name, id: props.userId, color: "", avatar: "" };
    activeSocket?.emit("sendMessage", { user, message });
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
        <Chat messages={messages} handleSendMessage={sendMessage} />
      </>
    );
}
