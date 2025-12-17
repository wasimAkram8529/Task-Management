import { Schema, model } from "mongoose";

const taskLogSchema = new Schema({
  taskId: {
    type: Schema.Types.ObjectId,
    ref: "Task",
    required: true,
    index: true,
  },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String },
  oldStatus: { type: String },
  newStatus: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const TaskLog = model("TaskLog", taskLogSchema);
