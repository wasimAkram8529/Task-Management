import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async () => {
  return mongoose.connect(env.mongoUri);
};
