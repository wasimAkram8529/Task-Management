import { Task } from "../models/task.model";
import { getDashboardData } from "../services/task.query.service";
import { asyncHandler } from "../utils/asyncHandler";

export const listTasks = asyncHandler(async (req: any, res: any) => {
  const { status, priority, sort } = req.query;

  const query: any = {};
  if (status) query.status = status;
  if (priority) query.priority = priority;

  const tasks = await Task.find(query).sort(sort ? { dueDate: 1 } : {});

  res.json(tasks);
});

export const dashboard = asyncHandler(async (req: any, res: any) => {
  const data = await getDashboardData(req.user.id);
  res.json(data);
});
