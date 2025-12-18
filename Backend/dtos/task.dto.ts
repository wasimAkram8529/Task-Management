import { z } from "zod";

export const createTaskDto = z.object({
  title: z.string().max(100),
  description: z.string(),
  dueDate: z.coerce.date(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  assignedToId: z.string(),
});

export const updateTaskDto = z.object({
  title: z.string().max(100),
  description: z.string(),
  dueDate: z.coerce.date(),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  assignedToId: z.string().optional(),
});
