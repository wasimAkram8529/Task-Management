import { Task } from "../models/task.model";
import { updateTask } from "../services/task.service";
import { AppError } from "../utils/appError";

jest.mock("../models/task.model");
jest.mock("../models/user.model");
jest.mock("../models/taskLog.model");
jest.mock("../models/notification.model");
jest.mock("../sockets/socket", () => ({
  broadcast: jest.fn(),
  emitToUser: jest.fn(),
}));

describe("updateTask Service Logic", () => {
  const mockTaskId = "task123";
  const mockUserId = "user789";
  const mockAssigneeId = "worker456";

  let mockExistingTask: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockExistingTask = {
      _id: mockTaskId,
      title: "Old Title",
      description: "Old Desc",
      status: "TODO",
      priority: "MEDIUM",
      creatorId: mockUserId,
      assignedToId: mockAssigneeId,
      save: jest.fn().mockResolvedValue(true),
    };
  });

  it("should throw 403 if user is neither creator nor assignee", async () => {
    (Task.findById as jest.Mock).mockResolvedValue(mockExistingTask);

    await expect(
      updateTask(mockTaskId, { status: "DONE" }, "intruder-id", "Intruder")
    ).rejects.toThrow(
      new AppError("Forbidden: You are not involved in this task", 403)
    );
  });

  it("should throw 403 if assignee tries to change the title", async () => {
    (Task.findById as jest.Mock).mockResolvedValue(mockExistingTask);

    const updateData = { title: "Hacker Title", status: "IN_PROGRESS" };

    await expect(
      updateTask(mockTaskId, updateData, mockAssigneeId, "The Worker")
    ).rejects.toThrow(/Only the creator can modify core task details/);
  });

  it("should allow assignee to send the SAME title without error (Diffing)", async () => {
    (Task.findById as jest.Mock).mockResolvedValue(mockExistingTask);

    const updateData = { title: "Old Title", status: "IN_PROGRESS" };

    const result = await updateTask(
      mockTaskId,
      updateData,
      mockAssigneeId,
      "The Worker"
    );

    expect(result).toBeDefined();
  });
});
