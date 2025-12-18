import nodemailer from "nodemailer";
import { env } from "../config/env";

export const sendResetLinkToEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  const emailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });

  await emailTransporter.sendMail({
    from: `"Task Manager" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
