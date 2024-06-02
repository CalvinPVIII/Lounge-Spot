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
}
