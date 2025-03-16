export interface APIResponse {
  status: "success" | "error";
  message: string;
}

export interface JoinRoomBody {
  roomCode: "string";
  userName: "string";
}

export interface JoinRoomResponse extends APIResponse {
  data: { userId: string };
}

export interface CreateRoomResponse extends APIResponse {
  data: { roomCode: string };
}

export interface UserInfo {
  name: string;
  id: string;
  color: string;
  avatar: string;
}

export interface ChatMessage {
  message: string;
  user: UserInfo;
  timestamp: string;
}

export interface RoomState {
  members: { [id: string]: UserInfo };
  messages: ChatMessage[];
  videoInfo: VideoPlayerState;
}

export interface VideoPlayerState {
  url: string;
  playing: boolean;
  currentTime: number;
  maxTime: number;
  startTimeStamp: number;
  pauseTimeStamp: number;
  playPauseOffset: number;
  queue: QueueVideoInfo[];
  currentVideoId: string;
  skipVotes: string[];
  loading: boolean;
}

type Thumbnail = {
  height: number;
  url: string;
  width: number;
};

type DescriptionSnippet = {
  text: string;
};

type Accessibility = {
  duration: string;
  title: string;
};

type Channel = {
  id: string;
  link: string;
  name: string;
  thumbnails: Thumbnail[];
};

type RichThumbnail = {
  height: number;
  url: string;
  width: number;
};

type ViewCount = {
  short: string;
  text: string;
};

export interface VideoInfo {
  accessibility: Accessibility;
  channel: Channel;
  descriptionSnippet: DescriptionSnippet[];
  duration: string;
  id: string;
  link: string;
  publishedTime: string;
  richThumbnail: RichThumbnail;
  thumbnails: Thumbnail[];
  title: string;
  type: string;
  viewCount: ViewCount;
  skipVotes: string[];
}

export interface SearchApiResponse extends APIResponse {
  data: VideoInfo[];
}

export interface QueueVideoInfo {
  title?: string;
  channel?: string;
  url?: string;
  thumbnail?: string;
  id?: string;
  type?: "Movie" | "YouTube";
  ref?: string;
}

export interface MovieInfo {
  id: string;
  title: string;
  url: string;
  image: string;
  releaseDate: string;
  description: string;
  genres: string[];
  type: "Movie" | "TV";
  casts: string[];
  tags: string[];
  production: string;
  duration: string;
  episodes: Array<{
    id: string;
    url: string;
    title: string;
    number: number;
    season: number;
  }>;
}

export interface MovieInSearchResult {
  id: string;
  url: string;
  title: string;
  image: string;
  releaseDate: string;
  type: "Movie" | "TV Series";
}

export interface MovieSearchResults {
  currentPage: number;
  hasNextPage: boolean;
  results: MovieInSearchResult[];
}

export interface MovieFileResponse {
  headers: {
    Referer: string;
  };
  sources: Array<{
    url: string;
    quality: string;
    isM3U8: boolean;
  }>;
  subtitles: Array<{
    url: string;
    lang: string;
  }>;
}
