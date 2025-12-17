import { Router } from "express";
import {
  create,
  getTaskLogs,
  remove,
  update,
} from "../controllers/task.controller";
import { dashboard, listTasks } from "../controllers/task.query.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/create-task", authMiddleware, create);
router.patch("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, remove);
router.get("/", authMiddleware, listTasks);
router.get("/dashboard", authMiddleware, dashboard);
router.get("/:taskId/logs", authMiddleware, getTaskLogs);

export default router;
