import { useState } from "react";
import FlaskApiHelper from "../helpers/flaskApiHelper";

interface HomeProps {
  handleJoinRoom: (code: string, userId: string, name: string) => void;
}

export default function Home(props: HomeProps) {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangeRoomCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomCode(e.target.value);
  };

  const handleCreateRoom = async () => {
    if (name === "") {
      setError("Please enter a name");
      return;
    }
    const createRoomResponse = await FlaskApiHelper.createRoom();
    console.log(createRoomResponse);

    setError("");
  };

  const handleJoinRoom = async () => {
    if (name === "") {
      setError("Please enter a name");
      return;
    }
    if (roomCode === "") {
      setError("Please enter a room code");
      return;
    }
    const joinRoomResponse = await FlaskApiHelper.joinRoom(name, roomCode.toUpperCase());
    if (joinRoomResponse.status === "success") {
      props.handleJoinRoom(roomCode, joinRoomResponse.data.userId, name);
    }
    console.log(joinRoomResponse);
  };

  return (
    <>
      {error ? <p className="error"> {error}</p> : null}
      <p>Name:</p>
      <input value={name} onChange={handleChangeName} />

      <p>Room Code:</p>
      <input value={roomCode} onChange={handleChangeRoomCode} />
      <button onClick={handleJoinRoom}>Join Room</button>
      <br />
      <button onClick={handleCreateRoom}>Create Room</button>
    </>
  );
}
