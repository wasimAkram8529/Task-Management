import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
