import { Task } from "../models/task.model";
import { Notification } from "../models/notification.model";
import { emitToUser, broadcast } from "../sockets/socket";
import { AppError } from "../utils/appError";
import { TaskLog } from "../models/taskLog.model";

export const createTask = async (data: any, userId: string) => {
  if (data.dueDate < new Date()) {
    throw new AppError("Due date cannot be in the past", 400);
  }

  const task: any = await Task.create({
    ...data,
    creatorId: userId,
  });

  if (task.assignedToId) {
    const notification = await Notification.create({
      userId: task.assignedToId,
      message: `New task assigned: ${task.title}`,
    });

    emitToUser(task.assignedToId.toString(), "notification:new", notification);
    broadcast("task:updated", task);
  }

  return task;
};

export const updateTask = async (
  taskId: string,
  data: any,
  userId: string,
  userName: string
) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError("Task not found", 404);

  const isCreator = task.creatorId.toString() === userId;
  const isAssignee = task.assignedToId.toString() === userId;

  if (!isCreator && !isAssignee) {
    throw new AppError("Forbidden", 403);
  }

  if (!isCreator && data.assignedToId) {
    throw new AppError("Only creator can reassign task", 403);
  }

  if (!isCreator && data.priority) {
    throw new AppError("Only creator can change priority", 403);
  }

  const oldStatus = task.status;
  const oldAssignee = task.assignedToId?.toString();

  // Detect if status is changing
  if (data.status && data.status !== oldStatus) {
    await TaskLog.create({
      taskId: task._id,
      userId,
      userName, // Ensure this is passed from the controller
      oldStatus,
      newStatus: data.status,
    });
  }

  // Detect if assignee is changing (Optional: Log this too!)
  if (data.assignedToId && data.assignedToId !== oldAssignee) {
    await TaskLog.create({
      taskId: task._id,
      userId,
      userName,
      oldStatus: `Assigned to ${oldAssignee}`,
      newStatus: `Assigned to ${data.assignedToId}`,
    });
  }

  Object.assign(task, data);
  await task.save();

  // Assignment Notification
  if (data.assignedToId && data.assignedToId !== oldAssignee) {
    const notification = await Notification.create({
      userId: data.assignedToId,
      message: `You have been assigned a new task: ${task.title}`,
    });

    emitToUser(data.assignedToId, "notification:new", notification);
    // Real time update for all users
    broadcast("task:updated", task);
  }

  return task;
};

export const deleteTask = async (taskId: string, userId: string) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError("Task not found", 404);

  if (task.creatorId.toString() !== userId) {
    throw new AppError("Only creator can delete task", 403);
  }

  await task.deleteOne();
  broadcast("task:updated", { _id: taskId, deleted: true });
};

// export const updateTaskStatus = async (
//   taskId: string,
//   userId: string,
//   newStatus: string,
//   userName: string
// ) => {
//   type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";

//   const task = await Task.findById(taskId);
//   if (!task) throw new AppError("Task not found", 404);

//   const oldStatus = task.status;

//   if (oldStatus !== newStatus) {
//     task.status = newStatus as TaskStatus;
//     await task.save();

//     await TaskLog.create({
//       taskId,
//       userId,
//       userName,
//       oldStatus,
//       newStatus,
//     });

//     broadcast("task:updated", { taskId, newStatus, updatedBy: userName });
//   }

//   return task;
// };
