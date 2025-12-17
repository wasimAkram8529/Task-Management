import { createTaskDto, updateTaskDto } from "../dtos/task.dto";
import { TaskLog } from "../models/taskLog.model";
import { createTask, deleteTask, updateTask } from "../services/task.service";
import { asyncHandler } from "../utils/asyncHandler";

export const create = asyncHandler(async (req: any, res: any) => {
  const data = createTaskDto.parse(req.body);
  const task = await createTask(data, req.user.id);
  res.status(201).json(task);
});

export const update = asyncHandler(async (req: any, res: any) => {
  const data = updateTaskDto.parse(req.body);
  const task = await updateTask(
    req.params.id,
    data,
    req.user.id,
    req.user.name
  );

  res.json(task);
});

export const remove = asyncHandler(async (req: any, res: any) => {
  await deleteTask(req.params.id, req.user.id);
  res.status(204).send();
});

export const getTaskLogs = asyncHandler(async (req: any, res: any) => {
  const { taskId } = req.params;
  const logs = await TaskLog.find({ taskId })
    .populate("userId", "name")
    .sort({ timestamp: -1 });
  res.json(logs);
});
