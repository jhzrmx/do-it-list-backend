import { generateToken } from "@/utils/generate-token";
import crypto from "crypto";
import { Request, Response } from "express";
import PasswordReset from "../models/password-reset.model";
import User from "../models/user.model";
import emailService from "../services/email.service";
import { validatePassword } from "../utils/validate-password";

export const sendLink = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: "If the email exists, a reset link has been sent.",
      });
    }

    await PasswordReset.deleteMany({ user: user._id });

    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await PasswordReset.create({
      user: user._id,
      token: hashedToken,
      expiresAt,
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

    await emailService.sendPasswordResetEmail(user.email, resetLink);

    return res.status(200).json({
      message: "If the email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to send reset email",
    });
  }
};

export const verifyLink = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const resetRequest = await PasswordReset.findOne({
      token: hashedToken,
      used: false,
    });

    if (!resetRequest) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (resetRequest.expiresAt < new Date()) {
      return res.status(400).json({ message: "Token expired" });
    }

    return res.status(200).json({ message: "Token valid" });
  } catch {
    return res.status(500).json({ message: "Verification failed" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const resetRequest = await PasswordReset.findOne({
      token: hashedToken,
      used: false,
    });

    if (!resetRequest) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (resetRequest.expiresAt < new Date()) {
      return res.status(400).json({ message: "Token expired" });
    }

    const user = await User.findById(resetRequest.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword; // pre-save will hash
    await user.save();

    resetRequest.used = true;
    await resetRequest.save();

    const jwt = generateToken(user._id.toString(), res);

    return res.status(200).json({
      message: "Password updated successfully",
      token: jwt,
    });
  } catch {
    return res.status(500).json({ message: "Password reset failed" });
  }
};
