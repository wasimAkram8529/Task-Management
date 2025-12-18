import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const socket: Socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket"],
});

export const useSocket = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    console.log("Connecting socket for user:");
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket Connected!");
      socket.emit("join", userId);
    });

    socket.on("task:updated", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    });

    socket.on("notification:new", (notification: any) => {
      toast.success(notification.message);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    socket.on("connect_error", (err) => {
      console.error("Socket Connection Error:", err.message);
    });

    return () => {
      socket.off("connect");
      socket.off("task:updated");
      socket.off("notification:new");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [userId, queryClient]);
};
