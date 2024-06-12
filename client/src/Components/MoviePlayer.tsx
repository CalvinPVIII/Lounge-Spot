import { useEffect, useRef } from "react";
import ReactHlsPlayer from "react-hls-player";
import { VideoPlayerState } from "../types";

interface MoviePlayerProps {
  videoState: VideoPlayerState;
  handlePlayVideo: () => void;
  handlePauseVideo: () => void;
  onVideoEnd: () => void;
  muted: boolean;
  volume: number;
  syncMoviePlayerTrigger: number;
}
export default function MoviePlayer(props: MoviePlayerProps) {
  const playerRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      if (!playerRef) return;
      syncPlayer();
      if (props.videoState.playing) {
        //@ts-expect-error used as per example in docs
        playerRef.current.play();
      }
    }, 1000);
  }, [props.videoState.url]);

  useEffect(() => {
    syncPlayer();
  }, [props.syncMoviePlayerTrigger]);

  useEffect(() => {
    if (props.videoState.playing) {
      //@ts-expect-error used as per example in docs
      playerRef.current.play();
    } else {
      //@ts-expect-error used as per example in docs
      playerRef.current.pause();
    }
  }, [props.videoState.playing]);

  useEffect(() => {
    //@ts-expect-error used as per example in docs
    playerRef.current.volume = props.volume / 100;
  }, [props.volume]);

  const syncPlayer = () => {
    if (props.videoState.startTimeStamp === 0) return;

    if (props.videoState.playPauseOffset !== 0 && props.videoState.playing === false) {
      //@ts-expect-error current time is on video
      playerRef.current.currentTime = props.videoState.playPauseOffset + 1;
    } else {
      const currentTime = (Date.now() + 1000) / 1000 + props.videoState.playPauseOffset;
      const videoPlayingLength = currentTime - props.videoState.startTimeStamp;
      //@ts-expect-error current time is on video

      playerRef.current.currentTime = videoPlayingLength;
    }
  };

  return (
    <>
      <ReactHlsPlayer
        //@ts-expect-error this is how player ref is used in docs
        playerRef={playerRef}
        src={props.videoState.url}
        onPlay={props.handlePlayVideo}
        onPause={props.handlePauseVideo}
        onEnded={props.onVideoEnd}
        width="100%"
        height="100%"
        muted={props.muted}
      />
    </>
  );
}
