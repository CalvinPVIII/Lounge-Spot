import { QueueVideoInfo } from "../types";
import "../styles/VideoQueue.css";

interface VideoQueueProps {
  queue: QueueVideoInfo[];
}

export default function VideoQueue(props: VideoQueueProps) {
  return (
    <>
      {props.queue.length === 0 ? (
        <p id="no-videos-message">There are no videos in the queue</p>
      ) : (
        <>
          {props.queue.map((video) => (
            <div className="video-queue-wrapper">
              <div className="video-queue-right">
                <img src={video.thumbnail} />
              </div>
              <div className="video-queue-left">
                <p className="video-queue-title">{video.title}</p>
                <p className="video-queue-channel">{video.channel}</p>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}
