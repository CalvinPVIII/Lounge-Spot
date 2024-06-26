import { Button, CircularProgress, IconButton, Slider } from "@mui/material";
import { QueueVideoInfo, UserInfo, VideoPlayerState } from "../types";
import ReactPlayer from "react-player";
import { useRef, useEffect, useState } from "react";
import "../styles/VideoPlayer.css";
import { VolumeDown, VolumeUp, VolumeOffOutlined, PlayArrowOutlined, PauseOutlined, Sync } from "@mui/icons-material";
import { useMediaQuery } from "react-responsive";
import MoviePlayer from "./MoviePlayer";

interface VideoPlayerProps {
  handlePlayVideo: () => void;
  handlePauseVideo: () => void;
  videoState: VideoPlayerState;
  addToQueue: (video: QueueVideoInfo) => void;
  onVideoEnd: () => void;
  handleVoteSkip: () => void;
  members: { [id: string]: UserInfo };
}

export default function VideoPlayer(props: VideoPlayerProps) {
  const player = useRef<ReactPlayer>(null);
  const [playerVolume, setPlayerVolume] = useState(50);
  const [muted, setPlayerMuted] = useState(false);
  const isBigScreen = useMediaQuery({ query: "(min-width: 950px)" });
  const [syncMoviePlayerTrigger, setSyncMoviePlayerTrigger] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      if (!player) return;
      syncPlayer();
    }, 1000);
  }, [props.videoState.url]);

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

  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    setPlayerVolume(newValue as number);
  };

  const handleMute = () => {
    setPlayerMuted(!muted);
  };

  const syncMoviePlayer = () => {
    setSyncMoviePlayerTrigger(syncMoviePlayerTrigger + 1);
  };

  return (
    <>
      <div id={isBigScreen ? "player-wrapper" : "player-wrapper-small"}>
        {props.videoState.queue[0] && props.videoState.queue[0].type === "Movie" ? (
          <MoviePlayer
            syncMoviePlayerTrigger={syncMoviePlayerTrigger}
            videoState={props.videoState}
            handlePauseVideo={props.handlePauseVideo}
            handlePlayVideo={props.handlePlayVideo}
            onVideoEnd={props.onVideoEnd}
            muted={muted}
            volume={playerVolume}
          />
        ) : (
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
        )}
        {props.videoState.loading ? (
          <div id="loading-circle">
            <CircularProgress />
          </div>
        ) : null}
      </div>

      <div id={isBigScreen ? "player-controls-wrapper" : "player-controls-wrapper-small"}>
        <div>
          {props.videoState.playing ? (
            <div id="play-pause-button">
              <IconButton onClick={props.handlePauseVideo} color="secondary" disabled={props.videoState.url === "" ? true : false}>
                <PauseOutlined />
              </IconButton>
            </div>
          ) : (
            <div id="play-pause-button">
              <IconButton onClick={props.handlePlayVideo} color="secondary" disabled={props.videoState.url === "" ? true : false}>
                <PlayArrowOutlined />
              </IconButton>
            </div>
          )}
        </div>

        <div id={isBigScreen ? "volume-controls" : "volume-controls-small"}>
          {playerVolume === 0 || muted ? <VolumeOffOutlined onClick={handleMute} /> : <VolumeDown onClick={handleMute} />}

          <Slider aria-label="Volume" value={playerVolume} onChange={handleVolumeChange} min={0} max={100} />
          <VolumeUp />
        </div>
        <div id="skip-info">
          <Button onClick={props.handleVoteSkip} color="secondary" disabled={props.videoState.url === "" ? true : false}>
            Vote to skip
          </Button>
          <p>
            {props.videoState.skipVotes.length}/{Math.ceil(Object.values(props.members).length / 2)}
            {}
          </p>
        </div>
        <div id="sync-spacer"></div>
        <IconButton
          onClick={props.videoState.queue[0] && props.videoState.queue[0].type === "Movie" ? syncMoviePlayer : syncPlayer}
          disabled={props.videoState.url === "" ? true : false}
        >
          <Sync />
        </IconButton>
      </div>
    </>
  );
}
