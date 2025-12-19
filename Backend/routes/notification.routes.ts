import { Router } from "express";
import {
  getUserNotifications,
  markAsRead,
} from "../controllers/notification.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getUserNotifications);
router.patch("/read", authMiddleware, markAsRead);

export default router;
