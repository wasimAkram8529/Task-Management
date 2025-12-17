// src/controllers/user.controller.ts
import { asyncHandler } from "../utils/asyncHandler";
import { updateProfileDto } from "../dtos/user.dto";
import { User } from "../models/user.model";
import { AppError } from "../utils/appError";

export const updateProfile = asyncHandler(async (req: any, res: any) => {
  const data = updateProfileDto.parse(req.body);

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name: data.name },
    { new: true }
  ).select("-passwordHash");

  if (!user) throw new AppError("User not found", 404);

  res.json(user);
});

export const listUsers = asyncHandler(async (req: any, res: any) => {
  const users = await User.find().select("_id name email");
  res.json(users);
});
