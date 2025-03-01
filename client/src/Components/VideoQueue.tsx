import { QueueVideoInfo } from "../types";
import "../styles/VideoQueue.css";
import { useMediaQuery } from "react-responsive";

interface VideoQueueProps {
  queue: QueueVideoInfo[];
}

export default function VideoQueue(props: VideoQueueProps) {
  const isBigScreen = useMediaQuery({ query: "(min-width: 950px)" });

  return (
    <>
      {props.queue.length === 0 ? (
        <p id="no-videos-message">There are no videos in the queue</p>
      ) : (
        <div className={isBigScreen ? "" : "video-queue-small scroll-bar"}>
          {props.queue.map((video) => (
            <div className="video-queue-wrapper" key={video.id}>
              <div className="video-queue-right">
                <img src={video.thumbnail} />
              </div>
              <div className="video-queue-left">
                <p className="video-queue-title">{video.title}</p>
                <p className="video-queue-channel">{video.channel}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
