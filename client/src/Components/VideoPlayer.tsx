import { Button } from "@mui/material";
import { VideoPlayerState } from "../types";
import ReactPlayer from "react-player";
import { useRef, useEffect } from "react";
interface VideoPlayerProps {
  handlePlayVideo: () => void;
  handlePauseVideo: () => void;
  videoState: VideoPlayerState;
}

export default function VideoPlayer(props: VideoPlayerProps) {
  const player = useRef<ReactPlayer>(null);

  useEffect(() => {
    setTimeout(() => {
      if (!player) return;
      syncPlayer();
    }, 300);
  }, []);

  const seek = () => {
    player.current?.seekTo(100);
  };

  const syncPlayer = () => {
    console.log("SYNC");
    const currentTime = (Date.now() + 300) / 1000;
    const videoPlayingLength = currentTime - props.videoState.startTimeStamp;
    player.current?.seekTo(videoPlayingLength, "seconds");
  };

  return (
    <>
      <ReactPlayer
        ref={player}
        url={"https://www.youtube.com/watch?v=rqxAn0vBeJ4"}
        playing={props.videoState.playing}
        allow="encrypted-media"
        onPlay={props.handlePlayVideo}
        onPause={props.handlePauseVideo}
        onStart={syncPlayer}
        config={{
          youtube: {
            playerVars: { showinfo: 0 },
          },
        }}
      />

      <h1>Playing: {props.videoState.playing}</h1>
      <Button onClick={seek}>seek</Button>

      <Button onClick={props.handlePlayVideo}>Play</Button>
      <Button onClick={props.handlePauseVideo}>Pause</Button>
    </>
  );
}
