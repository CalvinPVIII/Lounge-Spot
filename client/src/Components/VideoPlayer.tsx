import { Alert, Button, CircularProgress, IconButton, List, ListItem, ListItemText, Popover, Slider, Snackbar } from "@mui/material";
import { QueueVideoInfo, Subtitle, UserInfo, VideoPlayerState } from "../types";
import ReactPlayer from "react-player";
import { useRef, useEffect, useState } from "react";
import { VideoSeekSlider } from "react-video-seek-slider";
import "react-video-seek-slider/styles.css";
import "../styles/VideoPlayer.css";
import {
  VolumeDown,
  VolumeUp,
  VolumeOffOutlined,
  PlayArrowOutlined,
  PauseOutlined,
  Sync,
  Fullscreen,
  ClosedCaption,
  FiberManualRecord,
  Forward10,
  Replay10,
} from "@mui/icons-material";
import { useMediaQuery } from "react-responsive";
import { OnProgressProps } from "react-player/base";

interface VideoPlayerProps {
  handlePlayVideo: () => void;
  handlePauseVideo: () => void;
  videoState: VideoPlayerState;
  addToQueue: (video: QueueVideoInfo) => void;
  onVideoEnd: () => void;
  handleVoteSkip: () => void;
  members: { [id: string]: UserInfo };
  handleUpdateVideoTime: (time: number) => void;
  handleSeekToVideoTime: (time: number) => void;
  userId: string;
  forceSyncPlayer: number;
}

export default function VideoPlayer(props: VideoPlayerProps) {
  const player = useRef<ReactPlayer>(null);
  const [playerVolume, setPlayerVolume] = useState(50);
  const [muted, setPlayerMuted] = useState(false);
  const isBigScreen = useMediaQuery({ query: "(min-width: 950px)" });
  const [playerLoading, setPlayerLoading] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [selectedSubtitles, setSelectedSubtitles] = useState<Subtitle | null>(null);
  const [subtitleMenuOpen, setSubtitleMenuOpen] = useState(false);
  const [fastForwardDisabled, setFastForwardDisabled] = useState(false);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleSubtitlesClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setSubtitleMenuOpen(true);
  };

  const handleSubtitlesClose = () => {
    setAnchorEl(null);
    setSubtitleMenuOpen(false);
  };

  const handleOpenErrorSnackbar = () => {
    setErrorSnackbarOpen(true);
  };

  const handleCloseErrorSnackbar = () => {
    setErrorSnackbarOpen(false);
  };

  const handleProgress = (e: OnProgressProps) => {
    const membersArray = Object.values(props.members);
    if (membersArray[0].userId === props.userId) {
      props.handleUpdateVideoTime(e.playedSeconds);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (!player) return;
      syncPlayer();
    }, 1000);
  }, [props.videoState.url]);

  useEffect(() => {
    syncPlayer();
  }, [props.forceSyncPlayer]);

  const syncPlayer = () => {
    setFastForwardDisabled(true);
    player.current?.seekTo(props.videoState.videoTime);
    setTimeout(() => {
      setFastForwardDisabled(false);
    }, 1500);
  };

  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    setPlayerVolume(newValue as number);
  };

  const handleMute = () => {
    setPlayerMuted(!muted);
  };

  const handleBufferEnd = () => {
    setPlayerLoading(false);
  };

  const handleBuffer = () => {
    setPlayerLoading(true);
  };

  const handleFullScreen = () => {
    const vidPlayer = document.querySelector(".react-player");
    vidPlayer?.requestFullscreen();
  };

  const handleChangeSubtitles = (subtitle: Subtitle | null) => {
    if (player.current) {
      const videoPlayer = player.current.getInternalPlayer();
      const tracks = videoPlayer.textTracks;
      for (let i = 0; i < tracks.length; i++) {
        if (subtitle !== null && tracks[i].language === subtitle.lang) {
          tracks[i].mode = "showing";
        } else {
          tracks[i].mode = "disabled";
        }
      }
    }
    setSelectedSubtitles(subtitle);
  };

  const handleFastForward = (forwards: boolean) => {
    if (!player.current) return;
    if (forwards) {
      if (player.current.getCurrentTime() + 10 >= player.current.getDuration()) {
        props.handleSeekToVideoTime(player.current.getDuration() - 1);
      } else {
        props.handleSeekToVideoTime(player.current.getCurrentTime() + 10);
      }
    } else {
      if (player.current.getCurrentTime() - 10 <= 0) {
        props.handleSeekToVideoTime(0);
      } else {
        props.handleSeekToVideoTime(player.current.getCurrentTime() - 10);
      }
    }
  };

  const handleSeek = (milliseconds: number) => {
    props.handleSeekToVideoTime(milliseconds / 1000);
  };

  return (
    <>
      <div id={isBigScreen ? "player-wrapper" : "player-wrapper-small"}>
        {playerLoading && (
          <span id="video-player-loading">
            <CircularProgress size={100} />
          </span>
        )}
        {props.videoState && (
          <ReactPlayer
            className="react-player"
            ref={player}
            url={props.videoState.url ? props.videoState.url : ""}
            playing={props.videoState.playing}
            allow="encrypted-media"
            onPlay={props.handlePlayVideo}
            onPause={props.handlePauseVideo}
            onStart={syncPlayer}
            onEnded={props.onVideoEnd}
            onBuffer={handleBuffer}
            onBufferEnd={handleBufferEnd}
            onError={handleOpenErrorSnackbar}
            onProgress={handleProgress}
            width="100%"
            height="100%"
            volume={playerVolume / 100}
            muted={muted}
            config={{
              // @ts-expect-error force use hls.js
              forceHLS: true,
              youtube: {
                playerVars: { showinfo: 0 },
              },
              file: {
                tracks: props.videoState.subtitles?.map((sub) => ({
                  kind: "subtitles",
                  src: sub.url,
                  srcLang: sub.lang,
                  language: sub.lang,
                  label: sub.lang,
                })),
                attributes: {
                  crossOrigin: "anonymous",
                },
              },
            }}
          />
        )}
        {props.videoState.url && player.current && (
          <div className="slider-wrapper">
            <VideoSeekSlider
              max={(player.current.getDuration() * 1000) | 0}
              currentTime={player.current.getCurrentTime() * 1000}
              onChange={handleSeek}
            />
          </div>
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
        <IconButton onClick={() => handleFastForward(false)} disabled={props.videoState.url === "" || fastForwardDisabled ? true : false}>
          <Replay10 />
        </IconButton>
        <IconButton onClick={() => handleFastForward(true)} disabled={props.videoState.url === "" || fastForwardDisabled ? true : false}>
          <Forward10 />
        </IconButton>
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
        {props.videoState.subtitles && props.videoState.subtitles.length > 0 && (
          <Popover
            open={subtitleMenuOpen}
            anchorEl={anchorEl}
            onClose={handleSubtitlesClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            sx={{
              "& .MuiPaper-root": {
                borderRadius: "8px",
                padding: "8px",
                minWidth: "150px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <List sx={{ padding: 0 }}>
              {props.videoState.subtitles.map((sub) => (
                <ListItem
                  key={sub.lang}
                  onClick={() => handleChangeSubtitles(sub)}
                  sx={{
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  {selectedSubtitles?.lang === sub.lang ? <FiberManualRecord fontSize="small" sx={{ marginRight: "6px" }} /> : null}
                  <ListItemText primary={sub.lang} />
                </ListItem>
              ))}
              <ListItem
                key={"no sub"}
                onClick={() => handleChangeSubtitles(null)}
                sx={{
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
              >
                {!selectedSubtitles ? <FiberManualRecord fontSize="small" sx={{ marginRight: "6px" }} /> : null}
                <ListItemText primary={"None"} />
              </ListItem>
            </List>
          </Popover>
        )}
        <IconButton disabled={!props.videoState.subtitles || props.videoState.subtitles.length === 0} onClick={handleSubtitlesClick}>
          <ClosedCaption />
        </IconButton>
        <IconButton onClick={handleFullScreen} disabled={props.videoState.url === ""}>
          <Fullscreen />
        </IconButton>
        <IconButton onClick={syncPlayer} disabled={props.videoState.url === "" ? true : false}>
          <Sync />
        </IconButton>
      </div>

      <Snackbar open={errorSnackbarOpen} autoHideDuration={2000} onClose={handleCloseErrorSnackbar}>
        <Alert onClose={handleCloseErrorSnackbar} severity="error">
          There was an error playing this video
        </Alert>
      </Snackbar>
    </>
  );
}
