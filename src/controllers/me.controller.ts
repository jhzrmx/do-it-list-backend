import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { validatePassword } from "../utils/validate-password";

interface AuthRequest extends Request {
  user?: any;
}

export const myInfo = async (req: AuthRequest, res: Response) => {
  const token = req.cookies.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    return res.status(200).json({ user });
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const updateMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;

    const { fullName, email, oldPassword, newPassword, imageUrl, deleteImage } =
      req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (fullName) user.fullName = fullName;

    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    if (oldPassword || newPassword) {
      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          message: "Both oldPassword and newPassword are required",
        });
      }

      const passwordError = validatePassword(newPassword);
      if (passwordError) {
        return res.status(400).json({ message: passwordError });
      }

      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "Wrong old password" });
      }

      if (oldPassword === newPassword) {
        return res.status(400).json({
          message: "New password must be different from old password",
        });
      }

      user.password = newPassword; // pre-save hook hashes it
    }

    if (imageUrl) {
      user.imageUrl = imageUrl;
    }

    if (deleteImage) {
      user.imageUrl = null;
    }

    await user.save();

    const updatedUser = await User.findById(userId).select("-password");

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch {
    return res.status(500).json({ message: "Failed to update user" });
  }
};

export const deleteMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.clearCookie("token");

    return res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch {
    return res.status(500).json({ message: "Failed to delete account" });
  }
};
