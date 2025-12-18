import { updateTask } from "../services/task.service";
import { Task } from "../models/task.model";
import { User } from "../models/user.model";
import { TaskLog } from "../models/taskLog.model";
import * as SocketUtils from "../sockets/socket";
import { Notification } from "../models/notification.model";

jest.mock("../sockets/socket", () => ({
  broadcast: jest.fn(),
  emitToUser: jest.fn(),
}));

jest.mock("../models/task.model");
jest.mock("../models/user.model");
jest.mock("../models/taskLog.model");
jest.mock("../models/notification.model");

describe("WebSocket Integration Logic", () => {
  const mockTaskId = "1234abc5678def90876abc123";
  const mockAdminId = "1234abc5678def90876abc124";
  const mockWorkerId = "1234abc5678def90876abc125";
  const mockWorker2Id = "1234abc5678def90876abc126";

  const mockTask = {
    _id: mockTaskId,
    title: "Test Task",
    creatorId: mockAdminId,
    assignedToId: mockWorkerId,
    status: "TODO",
    priority: "MEDIUM",
    save: jest.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (Task.findById as jest.Mock).mockResolvedValue(mockTask);

    (User.findById as jest.Mock).mockImplementation((id) =>
      Promise.resolve({ _id: id, name: "Mock User" })
    );

    (Notification.create as jest.Mock).mockResolvedValue({
      _id: "1234abc5678def90876abc127",
      userId: mockWorker2Id,
      message: `You have been assigned to: Test Task`,
    });

    (TaskLog.create as jest.Mock).mockResolvedValue({});
  });

  it("should broadcast to all users when a task is updated", async () => {
    await updateTask(mockTaskId, { status: "COMPLETED" }, mockAdminId, "Admin");

    expect(SocketUtils.broadcast).toHaveBeenCalledWith(
      "task:updated",
      expect.objectContaining({ _id: mockTaskId })
    );
  });

  it("should send persistent in-app notification when a new user is assigned", async () => {
    await updateTask(
      mockTaskId,
      { assignedToId: mockWorker2Id },
      mockAdminId,
      "Admin"
    );

    expect(SocketUtils.emitToUser).toHaveBeenCalledWith(
      mockWorker2Id,
      "notification:new",
      expect.objectContaining({
        message: expect.stringContaining("Test Task"),
      })
    );
  });
});
