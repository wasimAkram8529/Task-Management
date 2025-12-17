import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import userRoutes from "./routes/user.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/env";

export const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors({ origin: `${env.FRONTEND_URL}`, credentials: true }));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

app.use(errorMiddleware);
