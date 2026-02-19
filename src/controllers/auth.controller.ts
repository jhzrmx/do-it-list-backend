import { generateToken } from "@/utils/generate-token";
import { Request, Response } from "express";
import User from "../models/user.model";
import { validatePassword } from "../utils/validate-password";

export const signup = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;

    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      fullName,
      email,
      password, // will auto-hash via pre("save")
    });

    const token = generateToken(user._id.toString(), res);

    res.status(201).json({
      message: "User created",
      user: {
        id: user._id,
        fullName,
        email,
      },
      token,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Account not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = generateToken(user._id.toString(), res);

    res.json({
      user: { id: user._id, email: user.email, name: user.fullName },
      token,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
};
