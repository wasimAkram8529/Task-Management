// src/routes/user.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { listUsers, updateProfile } from "../controllers/user.controller";

const router = Router();

router.get("/", authMiddleware, listUsers);
router.patch("/me", authMiddleware, updateProfile);

export default router;
