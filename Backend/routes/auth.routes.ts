import { Router } from "express";
import {
  register,
  login,
  getMe,
  logout,
  forgotPasswordHandler,
  resetPasswordHandler,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { listUsers } from "../controllers/user.controller";

const router = Router();
router.get("/", authMiddleware, listUsers);
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPasswordHandler);
router.post("/reset-password/:token", resetPasswordHandler);
router.get("/me", authMiddleware, getMe);
router.post("/logout", authMiddleware, logout);

export default router;
