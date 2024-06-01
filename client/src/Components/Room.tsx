import { useEffect, useState } from "react";
// import { socket } from "../socket/socket";
import { io } from "socket.io-client";

interface RoomProps {
  roomCode: string;
  userId: string;
  name: string;
}

export default function Room(props: RoomProps) {
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    const url = import.meta.env.VITE_SERVER_URL;
    const socket = io(url, {
      extraHeaders: {
        "Room-Code": props.roomCode,
        "User-Id": props.userId,
        "User-Name": props.name,
      },
    });

    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <>
      <h1>ROOM: {props.roomCode}</h1>
    </>
  );
}
