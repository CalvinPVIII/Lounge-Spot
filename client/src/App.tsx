import Home from "./Components/Home";
import { useState } from "react";
import Room from "./Components/Room";
function App() {
  const [roomCode, setRoomCode] = useState<null | string>(null);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");

  const handleJoinRoom = (code: string, userId: string, userName: string) => {
    setRoomCode(code);
    setUserId(userId);
    setUserName(userName);
  };

  return <>{roomCode ? <Room roomCode={roomCode} userId={userId} name={userName} /> : <Home handleJoinRoom={handleJoinRoom} />}</>;
}

export default App;
