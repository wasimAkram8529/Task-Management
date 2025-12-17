import { createTask } from "../services/task.service";
import { AppError } from "../utils/appError";

describe("Task Service", () => {
  it("should not allow past due date", async () => {
    await expect(
      createTask(
        {
          title: "Test",
          description: "Test",
          dueDate: new Date("2020-01-01"),
          priority: "LOW",
          assignedToId: "507f1f77bcf86cd799439011",
        },
        "507f1f77bcf86cd799439011"
      )
    ).rejects.toThrow(AppError);
  });

  it("should throw error if task not found on update", async () => {
    // mock Task.findById to return null
  });

  it("should forbid reassignment by assignee", async () => {
    // mock task with different creatorId
  });
});
