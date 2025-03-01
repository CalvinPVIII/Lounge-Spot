import { useEffect, useState } from "react";
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
  const [joinFromUrl, setJoinFromUrl] = useState(false);

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangeRoomCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomCode(e.target.value.toUpperCase());
  };

  useEffect(() => {
    const currentPath = window.location.pathname;
    const joinRegex = /^\/join\/(.+)/;
    const match = currentPath.match(joinRegex);

    if (match) {
      const code = match[1];
      setJoinFromUrl(true);
      setRoomCode(code.toUpperCase());
    }
  }, []);

  const handleCreateRoom = async () => {
    if (name === "") {
      setError("Please enter a name");
      return;
    }
    const createRoomResponse = await FlaskApiHelper.createRoom();
    if (createRoomResponse.status === "success") {
      setError("");
      handleJoinRoom(createRoomResponse.data.roomCode);
    }
  };

  const handleJoinRoom = async (code?: string) => {
    if (!code) code = roomCode;
    if (name === "") {
      setError("Please enter a name");
      return;
    }
    if (code === "") {
      setError("Please enter a room code");
      return;
    }
    const joinRoomResponse = await FlaskApiHelper.joinRoom(name, code.toUpperCase());
    if (joinRoomResponse.status === "success") {
      props.handleJoinRoom(code, joinRoomResponse.data.userId, name);
    } else {
      setError(joinRoomResponse.message);
    }
  };

  return (
    <>
      <h1 id="home-header">Lounge Spot</h1>
      {error ? <p className="error"> {error}</p> : null}
      <div id="home-name-input">
        <div>
          <TextField label="name" value={name} onChange={handleChangeName} variant="standard" />
        </div>
      </div>
      {joinFromUrl ? (
        <Box textAlign="center">
          <p>Room: {roomCode}</p>
          <Button variant="outlined" onClick={() => handleJoinRoom()} size="small" className="home-button" sx={{ borderRadius: 28 }}>
            Join Room
          </Button>
        </Box>
      ) : (
        <>
          <div id="home-main-buttons">
            <div id="home-create">
              <div>
                <Button onClick={handleCreateRoom} variant="outlined" size="small" className="home-button" sx={{ borderRadius: 28 }}>
                  Create Room
                </Button>
              </div>
            </div>
            <div id="home-spacer"></div>
            <div id="home-join">
              <TextField label="room code" value={roomCode} onChange={handleChangeRoomCode} size="small" variant="standard" />
              <Box textAlign="center" marginTop={"15px"}>
                <Button variant="outlined" onClick={() => handleJoinRoom()} size="small" className="home-button" sx={{ borderRadius: 28 }}>
                  Join Room
                </Button>
              </Box>
            </div>
            <br />
          </div>
        </>
      )}
    </>
  );
}
