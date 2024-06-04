import { Alert, Button, Snackbar } from "@mui/material";
import "../styles/VideoSearch.css";
import { ChangeEvent, useState } from "react";
import FlaskApiHelper from "../helpers/flaskApiHelper";
import { VideoInfo } from "../types";

interface VideoSearchProps {
  handleRequestVideo: (url: string) => void;
}

export default function VideoSearch(props: VideoSearchProps) {
  const [searchInput, setSearchInput] = useState("");
  const [videoSearchResult, setVideoSearchResult] = useState<VideoInfo[]>([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleOpenSnackbar = () => {
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleAddVideoToQueue = (url: string) => {
    handleOpenSnackbar();
    props.handleRequestVideo(url);
  };

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleInputSearch = async () => {
    const searchResults = await FlaskApiHelper.searchVideo(searchInput);
    if (searchResults.status === "success") {
      setVideoSearchResult(searchResults.data);
    }
  };

  return (
    <>
      <div id="search-input">
        <input type="text" placeholder="paste url or search" value={searchInput} onChange={handleSearchInput} />
        <Button onClick={handleInputSearch}>Search</Button>
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
      <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          video added to queue
        </Alert>
      </Snackbar>
    </>
  );
}
