import { useState } from "react";
import FlaskApiHelper from "../helpers/flaskApiHelper";
import "../styles/Home.css";
import { Box, Button, TextField } from "@mui/material";

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
      <h1 id="home-header">Lounge Spot</h1>
      {error ? <p className="error"> {error}</p> : null}
      <div id="home-name-input">
        <div>
          <TextField label="name" value={name} onChange={handleChangeName} />
        </div>
      </div>
      <div id="home-main-buttons">
        <div id="home-create">
          <div>
            <Button onClick={handleCreateRoom} variant="outlined" size="small">
              Create Room
            </Button>
          </div>
        </div>
        <div id="home-spacer"></div>
        <div id="home-join">
          <TextField label="room code" value={roomCode} onChange={handleChangeRoomCode} size="small" />
          <Box textAlign="center" marginTop={"15px"}>
            <Button variant="outlined" onClick={handleJoinRoom} size="small">
              Join Room
            </Button>
          </Box>
        </div>
        <br />
      </div>
    </>
  );
}
