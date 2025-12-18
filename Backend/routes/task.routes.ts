import { Router } from "express";
import {
  create,
  getTaskLogs,
  remove,
  update,
} from "../controllers/task.controller";
import {
  getDashboardAllData,
  getAllTasks,
} from "../controllers/task.query.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/create-task", authMiddleware, create);
router.patch("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, remove);
router.get("/", authMiddleware, getAllTasks);
router.get("/dashboard", authMiddleware, getDashboardAllData);
router.get("/:taskId/logs", authMiddleware, getTaskLogs);

export default router;
