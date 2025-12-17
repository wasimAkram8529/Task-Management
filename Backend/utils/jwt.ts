import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const signToken = (payload: object) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });
