import { Task } from "../models/task.model";

export const getDashboardData = async (userId: string) => {
  const now = new Date();

  const assigned = await Task.find({ assignedToId: userId });
  const created = await Task.find({ creatorId: userId });
  const overdue = await Task.find({
    assignedToId: userId,
    dueDate: { $lt: now },
    status: { $ne: "COMPLETED" },
  });

  return { assigned, created, overdue };
};
