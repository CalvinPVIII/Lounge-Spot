import { Alert, Button, CircularProgress, Snackbar, TextField } from "@mui/material";
import "../styles/VideoSearch.css";
import { ChangeEvent, FormEvent, useState } from "react";
import FlaskApiHelper from "../helpers/flaskApiHelper";
import { QueueVideoInfo, VideoInfo } from "../types";
import ReactPlayer from "react-player";
import { useMediaQuery } from "react-responsive";

interface VideoSearchProps {
  handleRequestVideo: (video: QueueVideoInfo) => void;
}

export default function VideoSearch(props: VideoSearchProps) {
  const [searchInput, setSearchInput] = useState("");
  const [videoSearchResult, setVideoSearchResult] = useState<VideoInfo[]>([]);
  const [buttonText, setButtonText] = useState("search");
  const [searching, setSearching] = useState(false);

  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  const isBigScreen = useMediaQuery({ query: "(min-width: 950px)" });

  const handleOpenSuccessSnackbar = () => {
    setSuccessSnackbarOpen(true);
  };

  const handleCloseSuccessSnackbar = () => {
    setSuccessSnackbarOpen(false);
  };

  const handleOpenErrorSnackbar = () => {
    setErrorSnackbarOpen(true);
  };

  const handleCloseErrorSnackbar = () => {
    setErrorSnackbarOpen(false);
  };

  const handleAddVideoToQueue = (video: VideoInfo | string) => {
    const videoToAdd: QueueVideoInfo = { url: "", type: "YouTube" };
    if (typeof video === "string") {
      videoToAdd.url = video;
      if (video.includes("twitch.tv")) {
        videoToAdd.title = video;
        videoToAdd.channel = "Livestream";
        videoToAdd.thumbnail = "https://cdn.iconscout.com/icon/free/png-256/free-twitch-11-461838.png?f=webp";
      }
    } else {
      videoToAdd.url = video.link;
      videoToAdd.thumbnail = video.thumbnails[0].url;
      videoToAdd.title = video.title;
      videoToAdd.channel = video.channel.name;
    }

    if (ReactPlayer.canPlay(videoToAdd.url)) {
      handleOpenSuccessSnackbar();
      props.handleRequestVideo(videoToAdd);
    } else {
      handleOpenErrorSnackbar();
    }
    setSearching(false);
  };

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setButtonText(checkIfUrlOrSearch(e.target.value));
  };

  const searchForVideos = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearching(true);
    const checkUrl = checkIfUrlOrSearch(searchInput);
    if (checkUrl === "add to queue") {
      handleAddVideoToQueue(searchInput);
      return;
    }
    const searchResults = await FlaskApiHelper.searchVideo(searchInput);
    if (searchResults.status === "success") {
      setVideoSearchResult(searchResults.data);
    }
    setSearching(false);
  };

  const checkIfUrlOrSearch = (url: string) => {
    if (url.includes("youtube.com/watch?v=") || url.includes("twitch.tv/")) {
      return "add to queue";
    } else {
      return "search";
    }
  };

  return (
    <>
      <form onSubmit={searchForVideos} className={isBigScreen ? "search-input" : "search-input-small"}>
        <TextField
          placeholder="paste url or search"
          value={searchInput}
          onChange={handleSearchInput}
          variant="standard"
          size="small"
          label="search"
        />
        <Button type="submit">{buttonText}</Button>
      </form>
      <div id="search-results" className={isBigScreen ? "" : "search-results-small scroll-bar"}>
        {searching ? (
          <CircularProgress />
        ) : (
          <>
            {videoSearchResult.map((video) => (
              <div key={video.id} className="video-wrapper">
                <div className="video-info-img">
                  <img src={video.thumbnails[0].url} className="video-thumbnail" />
                  <p className="video-duration">{video.duration}</p>
                </div>
                <div className="video-info">
                  <div className="channel-icon-container">
                    <img src={video.channel.thumbnails[0].url} className="channel-icon" />
                  </div>
                  <p className="video-title">{video.title}</p>
                </div>
                <div className="video-info-bottom">
                  <p>{video.channel.name}</p>
                  <p className="video-views-and-date">
                    {video.link.includes("youtube.com/") && !video.viewCount.short && !video.publishedTime ? (
                      <>• Live</>
                    ) : (
                      <>
                        {video.viewCount.short} • {video.publishedTime}
                      </>
                    )}
                  </p>
                </div>
                <div className="add-to-queue-button-wrapper">
                  <div>
                    <Button variant="outlined" color="secondary" onClick={() => handleAddVideoToQueue(video)}>
                      Add To Queue
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <Snackbar open={successSnackbarOpen} autoHideDuration={2000} onClose={handleCloseSuccessSnackbar}>
        <Alert onClose={handleCloseSuccessSnackbar} severity="success">
          video added to queue
        </Alert>
      </Snackbar>
      <Snackbar open={errorSnackbarOpen} autoHideDuration={2000} onClose={handleCloseErrorSnackbar}>
        <Alert onClose={handleCloseErrorSnackbar} severity="error">
          Unable To Play Video
        </Alert>
      </Snackbar>
    </>
  );
}
