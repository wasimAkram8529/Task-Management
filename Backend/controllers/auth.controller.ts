import { env } from "../config/env";
import { registerDto, loginDto } from "../dtos/auth.dto";
import { User } from "../models/user.model";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../services/auth.service";
import { AppError } from "../utils/appError";
import { asyncHandler } from "../utils/asyncHandler";

export const register = asyncHandler(async (req: any, res: any) => {
  const data = registerDto.parse(req.body);
  const token = await registerUser(data);

  res.cookie("token", token, { httpOnly: true }).json({ success: true });
});

export const login = asyncHandler(async (req: any, res: any) => {
  const data = loginDto.parse(req.body);
  const token = await loginUser(data);

  res.cookie("token", token, { httpOnly: true }).json({ success: true });
});

export const getMe = asyncHandler(async (req: any, res: any) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await User.findById(userId).select("-passwordHash");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  });
});

export const logout = asyncHandler(async (req: any, res: any) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
  });

  res.json({ success: true });
});

export const forgotPasswordHandler = asyncHandler(
  async (req: any, res: any) => {
    await forgotPassword(req.body.email);
    res.json({ message: "Reset link sent to email" });
  }
);

export const resetPasswordHandler = asyncHandler(async (req: any, res: any) => {
  const { token } = req.params;
  const { password } = req.body;

  await resetPassword(token, password);
  res.json({ message: "Password updated successfully" });
});
