import { Task } from "../models/task.model";
import { getDashboardData } from "../services/task.query.service";
import { asyncHandler } from "../utils/asyncHandler";

export const getAllTasks = asyncHandler(async (req: any, res: any) => {
  const { status, priority, sort } = req.query;

  const queryObject: any = {};

  if (status) queryObject.status = status;

  if (priority) queryObject.priority = priority;

  const tasks = await Task.find(queryObject).sort(sort ? { dueDate: 1 } : {});

  res.json(tasks);
});

export const getDashboardAllData = asyncHandler(async (req: any, res: any) => {
  const data = await getDashboardData(req.user.id);
  res.json(data);
});
