import { Server, Socket } from "socket.io";
import { env } from "../config/env";

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: `${env.FRONTEND_URL}`,
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket: Socket) => {
    socket.on("join", (userId: string) => {
      socket.join(userId);
    });
  });
};

export const emitToUser = (userId: string, event: string, payload: any) => {
  io.to(userId.toString()).emit(event, payload);
};

export const broadcast = (event: string, payload: any) => {
  io.emit(event, payload);
};
