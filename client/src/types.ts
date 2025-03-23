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
  userId: string;
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
  subtitles?: Array<Subtitle>;
  playing: boolean;
  videoTime: number;
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
  subtitles?: Subtitle[];
}

export interface MovieInfo {
  backdrop_path: string;
  id: number;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: string;
  adult: boolean;
  title: string;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date?: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
export interface TvInfo {
  adult: boolean;
  backdrop_path: string;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  media_type: string;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}

export interface MovieSearchResults {
  page: number;
  results: MovieInfo[];
  total_pages: number;
  total_results: number;
}

export interface MovieFileResponse {
  videoSource: string;
  subtitles?: Subtitle[];
}

export interface Subtitle {
  lang: string;
  file: string;
}

interface SeasonInfo {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}
export interface TvSeriesDetails {
  seasons: SeasonInfo[];
  id: number;
  original_name: string;
  poster_path: string;
}
