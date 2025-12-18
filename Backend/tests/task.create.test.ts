import { createTask } from "../services/task.service";
import { Task } from "../models/task.model";
import { Notification } from "../models/notification.model";
import { AppError } from "../utils/appError";
import { emitToUser, broadcast } from "../sockets/socket";

jest.mock("../models/task.model");
jest.mock("../models/notification.model");
jest.mock("../sockets/socket", () => ({
  emitToUser: jest.fn(),
  broadcast: jest.fn(),
}));

describe("createTask Service", () => {
  const mockUserId = "user123";
  const validTaskData = {
    title: "Test Task",
    description: "Test Description",
    dueDate: new Date(Date.now() + 86400000),
    assignedToId: "assignee456",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if the due date is in the past", async () => {
    const pastData = {
      ...validTaskData,
      dueDate: new Date(Date.now() - 86400000),
    };

    await expect(createTask(pastData, mockUserId)).rejects.toThrow(
      new AppError("Due date cannot be in the past", 400)
    );

    expect(Task.create).not.toHaveBeenCalled();
  });

  it("should create a task and emit notifications if assignedToId exists", async () => {
    const mockCreatedTask = {
      ...validTaskData,
      _id: "task789",
      creatorId: mockUserId,
    };
    const mockNotification = { _id: "notif1", message: "New task assigned..." };

    (Task.create as jest.Mock).mockResolvedValue(mockCreatedTask);
    (Notification.create as jest.Mock).mockResolvedValue(mockNotification);

    const result = await createTask(validTaskData, mockUserId);

    expect(Task.create).toHaveBeenCalledWith({
      ...validTaskData,
      creatorId: mockUserId,
    });
    expect(Notification.create).toHaveBeenCalled();
    expect(emitToUser).toHaveBeenCalledWith(
      validTaskData.assignedToId,
      "notification:new",
      mockNotification
    );
    expect(broadcast).toHaveBeenCalledWith("task:updated", mockCreatedTask);
    expect(result).toEqual(mockCreatedTask);
  });

  it("should create a task but NOT notify if assignedToId is missing", async () => {
    const unassignedData = { ...validTaskData, assignedToId: undefined };
    const mockCreatedTask = {
      ...unassignedData,
      _id: "task789",
      creatorId: mockUserId,
    };

    (Task.create as jest.Mock).mockResolvedValue(mockCreatedTask);

    await createTask(unassignedData, mockUserId);

    expect(Notification.create).not.toHaveBeenCalled();
    expect(emitToUser).not.toHaveBeenCalled();
    expect(broadcast).not.toHaveBeenCalled();
  });
});
