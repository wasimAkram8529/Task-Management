import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Force WebSocket only to solve the 400 error we saw earlier
const socket: Socket = io("http://localhost:5000", {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket"],
});

export const useSocket = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // If no user, just stop. Don't crash.
    if (!userId) return;

    console.log("Connecting socket for user:", userId);
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Socket Connected!");
      socket.emit("join", userId);
    });

    socket.on("task:updated", (data) => {
      console.log("⚡ Real-time update received!", data);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    });

    socket.on("notification:new", (notification: any) => {
      toast.success(notification.message, { icon: "🔔" });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket Connection Error:", err.message);
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
