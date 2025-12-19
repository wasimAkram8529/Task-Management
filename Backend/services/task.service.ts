import { Task } from "../models/task.model";
import { Notification } from "../models/notification.model";
import { emitToUser, broadcast } from "../sockets/socket";
import { AppError } from "../utils/appError";
import { TaskLog } from "../models/taskLog.model";
import { User } from "../models/user.model";

export const createTask = async (data: any, userId: string) => {
  if (data.dueDate) {
    const selectedDate = new Date(data.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    console.log(today, selectedDate);

    if (selectedDate < today) {
      throw new AppError("Due date cannot be in the past", 400);
    }
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
  // const isAssignee = task.assignedToId?.toString() === userId;

  // if (!isCreator && !isAssignee) {
  //   throw new AppError("Forbidden: You are not involved in this task", 403);
  // }

  const restrictedFields = ["title", "description", "dueDate"];
  if (!isCreator) {
    const hasActualRestrictedChange = Object.keys(data).some((field) => {
      if (!restrictedFields.includes(field as any)) return false;

      const newValue = data[field];
      const oldValue = (task as any)[field];

      if (oldValue === undefined || oldValue === null)
        return newValue !== oldValue;

      if (field === "dueDate" && newValue && oldValue) {
        return new Date(newValue).getTime() !== new Date(oldValue).getTime();
      }

      return newValue !== oldValue;
    });

    if (hasActualRestrictedChange) {
      throw new AppError(
        "Only the creator can modify core task details (Title, Description, or Due Date)",
        403
      );
    }
  }
  const oldStatus = task.status;
  const oldPriority = task.priority;
  const oldAssigneeId = task.assignedToId?.toString();

  if (data.dueDate) {
    const selectedDate = new Date(data.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      throw new AppError("Due date cannot be in the past", 400);
    }
  }

  if (data.status && data.status !== oldStatus) {
    await TaskLog.create({
      taskId: task._id,
      userId,
      userName,
      oldStatus: `Status: ${oldStatus}`,
      newStatus: `Status: ${data.status}`,
    });
  }

  if (data.priority && data.priority !== oldPriority) {
    await TaskLog.create({
      taskId: task._id,
      userId,
      userName,
      oldStatus: `Priority: ${oldPriority}`,
      newStatus: `Priority: ${data.priority}`,
    });
  }

  if (
    data.assignedToId !== undefined &&
    data.assignedToId?.toString() !== oldAssigneeId
  ) {
    const [oldUser, newUser] = await Promise.all([
      oldAssigneeId ? User.findById(oldAssigneeId) : Promise.resolve(null),
      data.assignedToId
        ? User.findById(data.assignedToId)
        : Promise.resolve(null),
    ]);

    const oldName = oldUser ? oldUser.name : "Unassigned";
    const newName = newUser ? newUser.name : "Unassigned";

    await TaskLog.create({
      taskId: task._id,
      userId,
      userName,
      oldStatus: `Assigned to: ${oldName}`,
      newStatus: `Assigned to: ${newName}`,
    });
  }

  Object.assign(task, data);
  await task.save();

  if (data.assignedToId && data.assignedToId.toString() !== oldAssigneeId) {
    const notification = await Notification.create({
      userId: data.assignedToId,
      message: `You have been assigned to: ${task.title}`,
    });
    emitToUser(data.assignedToId, "notification:new", notification);
  }

  broadcast("task:updated", task);

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
