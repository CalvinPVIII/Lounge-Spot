import { Alert, Button, Snackbar, TextField } from "@mui/material";
import "../styles/VideoSearch.css";
import { ChangeEvent, useState } from "react";
import FlaskApiHelper from "../helpers/flaskApiHelper";
import { VideoInfo } from "../types";
import ReactPlayer from "react-player";

interface VideoSearchProps {
  handleRequestVideo: (url: string) => void;
}

export default function VideoSearch(props: VideoSearchProps) {
  const [searchInput, setSearchInput] = useState("");
  const [videoSearchResult, setVideoSearchResult] = useState<VideoInfo[]>([]);
  const [buttonText, setButtonText] = useState("search");

  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

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

  const handleAddVideoToQueue = (url: string) => {
    if (ReactPlayer.canPlay(url)) {
      handleOpenSuccessSnackbar();
      props.handleRequestVideo(url);
    } else {
      handleOpenErrorSnackbar();
    }
  };

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setButtonText(checkIfUrlOrSearch(e.target.value));
  };

  const searchForVideos = async () => {
    const checkUrl = checkIfUrlOrSearch(searchInput);
    if (checkUrl === "add to queue") {
      handleAddVideoToQueue(searchInput);
      return;
    }
    const searchResults = await FlaskApiHelper.searchVideo(searchInput);
    if (searchResults.status === "success") {
      setVideoSearchResult(searchResults.data);
    }
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
      <div id="search-input">
        <TextField placeholder="paste url or search" value={searchInput} onChange={handleSearchInput} variant="filled" size="small" label="search" />
        <Button onClick={searchForVideos}>{buttonText}</Button>
      </div>
      <div id="search-results">
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
              <p>{video.title}</p>
            </div>
            <div className="video-info-bottom">
              <p>{video.channel.name}</p>
              <p className="video-views-and-date">
                {video.viewCount.short} • {video.publishedTime}
              </p>
            </div>
            <Button variant="outlined" color="secondary" onClick={() => handleAddVideoToQueue(video.link)}>
              Add To Queue
            </Button>
          </div>
        ))}
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
