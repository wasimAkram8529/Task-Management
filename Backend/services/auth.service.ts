import { IUser, User } from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";
import { AppError } from "../utils/appError";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterInput): Promise<string> => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new AppError("Email already registered", 400);
  }

  const passwordHash = await hashPassword(data.password);

  const user: IUser = await User.create({
    name: data.name,
    email: data.email,
    passwordHash,
  });

  return signToken({ id: user._id.toString() });
};

export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<string> => {
  const user = await User.findOne({ email: data.email });
  if (!user) throw new AppError("Invalid credentials", 401);

  const isValid = await comparePassword(data.password, user.passwordHash);
  if (!isValid) throw new AppError("Invalid credentials", 401);

  return signToken({ id: user._id.toString() });
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("User not found", 404);

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

  await user.save();

  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

  await sendEmail(
    user.email,
    "Reset your password",
    `<p>Click below to reset your password:</p>
     <a href="${resetUrl}">${resetUrl}</a>`
  );
};

export const resetPassword = async (token: string, newPassword: string) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) throw new AppError("Token invalid or expired", 400);

  user.passwordHash = await hashPassword(newPassword);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
};
