import { Request, Response } from "express";
import { Notification } from "../models/notification.model";
import mongoose from "mongoose";

export const getUserNotifications = async (req: Request, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const notifications = await Notification.find({
      userId: new mongoose.Types.ObjectId(req.user.id),
    } as any)
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await Notification.updateMany(
      {
        userId: new mongoose.Types.ObjectId(req.user.id),
        read: false,
      } as any,
      { $set: { read: true } }
    );
    res.status(200).json({ message: "Notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error updating notifications" });
  }
};
