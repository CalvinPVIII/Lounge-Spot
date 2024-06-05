import { Button, Slider } from "@mui/material";
import { VideoPlayerState } from "../types";
import ReactPlayer from "react-player";
import { useRef, useEffect, useState } from "react";
import "../styles/VideoPlayer.css";
import { VolumeDown, VolumeUp, VolumeOffOutlined, PlayArrowOutlined, PauseOutlined } from "@mui/icons-material";
import VideoSearch from "./VideoSearch";
interface VideoPlayerProps {
  handlePlayVideo: () => void;
  handlePauseVideo: () => void;
  videoState: VideoPlayerState;
  addToQueue: (url: string) => void;
  onVideoEnd: () => void;
  handleVoteSkip: () => void;
}

export default function VideoPlayer(props: VideoPlayerProps) {
  const player = useRef<ReactPlayer>(null);
  const [playerVolume, setPlayerVolume] = useState(50);
  const [muted, setPlayerMuted] = useState(false);
  console.log(props);

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

  const handleRequestVideo = (url: string) => {
    if (url === "") return;
    props.addToQueue(url);
  };

  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    setPlayerVolume(newValue as number);
  };

  const handleMute = () => {
    setPlayerMuted(!muted);
  };

  return (
    <>
      <div id="player-wrapper">
        <ReactPlayer
          className="react-player"
          ref={player}
          url={props.videoState.url}
          playing={props.videoState.playing}
          allow="encrypted-media"
          onPlay={props.handlePlayVideo}
          onPause={props.handlePauseVideo}
          onStart={syncPlayer}
          onEnded={props.onVideoEnd}
          width="100%"
          height="100%"
          volume={playerVolume / 100}
          muted={muted}
          config={{
            youtube: {
              playerVars: { showinfo: 0 },
            },
          }}
        />
      </div>

      <div id="player-controls-wrapper">
        <div>
          {props.videoState.playing ? (
            <Button onClick={props.handlePauseVideo} color="secondary" disabled={props.videoState.url === "" ? true : false}>
              <PauseOutlined />
            </Button>
          ) : (
            <Button onClick={props.handlePlayVideo} color="secondary" disabled={props.videoState.url === "" ? true : false}>
              <PlayArrowOutlined />
            </Button>
          )}
        </div>

        <div id="volume-controls">
          {playerVolume === 0 || muted ? <VolumeOffOutlined onClick={handleMute} /> : <VolumeDown onClick={handleMute} />}

          <Slider aria-label="Volume" value={playerVolume} onChange={handleVolumeChange} min={0} max={100} />
          <VolumeUp />
        </div>
        <Button onClick={props.handleVoteSkip} color="secondary" disabled={props.videoState.url === "" ? true : false}>
          Vote to skip
        </Button>
      </div>

      <VideoSearch handleRequestVideo={handleRequestVideo} />
    </>
  );
}
