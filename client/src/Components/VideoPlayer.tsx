import { Button } from "@mui/material";
import { VideoPlayerState } from "../types";
import ReactPlayer from "react-player";
import { useRef, useEffect, useState } from "react";
import "../styles/VideoPlayer.css";
interface VideoPlayerProps {
  handlePlayVideo: () => void;
  handlePauseVideo: () => void;
  videoState: VideoPlayerState;
  addToQueue: (url: string) => void;
  onVideoEnd: () => void;
}

export default function VideoPlayer(props: VideoPlayerProps) {
  const player = useRef<ReactPlayer>(null);
  const [urlInput, setUrlInput] = useState("");

  useEffect(() => {
    setTimeout(() => {
      if (!player) return;
      syncPlayer();
    }, 1000);
  }, [props.videoState]);

  const syncPlayer = () => {
    if (props.videoState.startTimeStamp === 0) return;

    if (props.videoState.playPauseOffset !== 0 && props.videoState.playing === false) {
      player.current?.seekTo(props.videoState.playPauseOffset + 1);
    } else {
      const currentTime = (Date.now() + 1000) / 1000 + props.videoState.playPauseOffset;
      const videoPlayingLength = currentTime - props.videoState.startTimeStamp;
      player.current?.seekTo(videoPlayingLength, "seconds");
    }
  };

  const handleRequestVideo = () => {
    if (urlInput === "") return;
    props.addToQueue(urlInput);
  };

  return (
    <>
      <div id="player-wrapper">
        <ReactPlayer
          ref={player}
          url={props.videoState.url}
          playing={props.videoState.playing}
          allow="encrypted-media"
          onPlay={props.handlePlayVideo}
          onPause={props.handlePauseVideo}
          onStart={syncPlayer}
          onEnded={props.onVideoEnd}
          width="100%"
          config={{
            youtube: {
              playerVars: { showinfo: 0 },
            },
          }}
        />
      </div>

      <h1>Playing: {props.videoState.playing}</h1>
      <input type="text" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} />
      <Button onClick={handleRequestVideo}>Add Video</Button>

      <Button onClick={props.handlePlayVideo}>Play</Button>
      <Button onClick={props.handlePauseVideo}>Pause</Button>
    </>
  );
}
