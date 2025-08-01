import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { createTeamJob } from "../services/teamService";
import { Types } from "mongoose";

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "fallback-secret", {
    expiresIn: "7d",
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = new User({ email, password });
    await user.save();

    const userId = (user._id as Types.ObjectId).toString();
    await createTeamJob(userId);
    const token = generateToken(userId);

    res.status(201).json({
      message: "User registered successfully. Team creation in progress.",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const userId = (user._id as Types.ObjectId).toString();
    const token = generateToken(userId);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        teamId: user.teamId,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
