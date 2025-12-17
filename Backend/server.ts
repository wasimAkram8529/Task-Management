import "dotenv/config";
import http from "http";
import { app } from "./app";
import { connectDB } from "./config/db";
import { initSocket } from "./sockets/socket";
import { env } from "./config/env";

const server = http.createServer(app);
initSocket(server);

const start = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected");

    server.listen(env.port, () =>
      console.log(`Server running on port ${env.port}`)
    );
  } catch (error) {
    console.error(error);
  }
};

start();
