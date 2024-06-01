import { JoinRoomResponse } from "../types";

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default class FlaskApiHelper {
  static async createRoom() {
    const response = await fetch(`${serverUrl}/room/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();
    return result;
  }

  static async joinRoom(userName: string, roomCode: string) {
    const response = await fetch(`${serverUrl}/room/join`, {
      method: "POST",
      body: JSON.stringify({ userName: userName, roomCode: roomCode }),
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();
    return result as JoinRoomResponse;
  }
}
