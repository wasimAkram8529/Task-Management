import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getUsers, updateProfile } from "../controllers/user.controller";

const router = Router();

router.get("/", authMiddleware, getUsers);
router.patch("/me", authMiddleware, updateProfile);

export default router;
