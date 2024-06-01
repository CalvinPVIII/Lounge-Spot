import { io } from "socket.io-client";

const url = import.meta.env.VITE_SERVER_URL;

export const socket = io(url);
