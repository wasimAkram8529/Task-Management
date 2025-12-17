import { Schema, model, Types } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, maxlength: 100, required: true },
    description: String,
    dueDate: Date,
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      required: true,
    },
    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"],
      default: "TODO",
    },
    creatorId: { type: Types.ObjectId, ref: "User", required: true },
    assignedToId: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

taskSchema.index({ assignedToId: 1 });
taskSchema.index({ creatorId: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ status: 1 });

export const Task = model("Task", taskSchema);
