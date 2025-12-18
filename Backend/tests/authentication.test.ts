import {
  registerUser,
  loginUser,
  forgotPassword,
} from "../services/auth.service";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppError } from "../utils/appError";
import { logout } from "../controllers/auth.controller";
import { sendResetLinkToEmail } from "../utils/sendEmail";

jest.mock("../models/user.model");
jest.mock("jsonwebtoken");
jest.mock("bcrypt");
jest.mock("../utils/sendEmail");

const mockUser = {
  _id: { toString: () => "1234abc5678def90876abc123" },
  email: "auth-test@gmail.com",
  password: "hashedPassword",
  name: "abcdefg",
};

describe("Auth Service: Registration and Login user", () => {
  it("should register a new user and return a token", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (User.create as jest.Mock).mockResolvedValue({
      ...mockUser,
      passwordHash: "hashedPassword",
    });
    (jwt.sign as jest.Mock).mockReturnValue("token");

    const result = await registerUser({
      email: "auth-test@gmail.com",
      password: "password123",
      name: "abcdefg",
    });

    expect(result).toBe("token");
    expect(User.create).toHaveBeenCalled();
  });

  it("should throw error if login email is not found", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      loginUser({ email: "wrong@email.com", password: "password" })
    ).rejects.toThrow(new AppError("Invalid credentials", 401));
  });
});

describe("Auth Controller: Logout", () => {
  it("should clear the JWT cookie on logout", async () => {
    const req = {} as any;
    const res = {
      clearCookie: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any;
    const next = jest.fn();

    await logout(req, res, next);

    expect(res.clearCookie).toHaveBeenCalledWith(
      "token",
      expect.objectContaining({
        httpOnly: true,
      })
    );
  });
});

describe("Auth Service: Password Recovery", () => {
  it("should generate a reset token, update user, and call email service", async () => {
    const mockUserInstance = {
      email: "auth-test@gmail.com",
      save: jest.fn().mockResolvedValue(true),
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUserInstance);
    (sendResetLinkToEmail as jest.Mock).mockResolvedValue(true);

    await forgotPassword("auth-test@gmail.com");

    expect(mockUserInstance.resetPasswordToken).toBeDefined();
    expect(mockUserInstance.resetPasswordExpires).toBeInstanceOf(Date);
    expect(mockUserInstance.save).toHaveBeenCalled();

    expect(sendResetLinkToEmail).toHaveBeenCalledWith(
      "auth-test@gmail.com",
      "Reset your password",
      expect.stringContaining("/reset-password/")
    );
  });
});
