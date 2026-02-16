import { Response } from "express";
import jwt from "jsonwebtoken";

export const generateToken = (user_id: string, res: Response): string => {
  const token = jwt.sign({ id: user_id }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
  return token;
};
