import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { createTeamForUser } from "../services/teamService";
import type { Types } from "mongoose";

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  return jwt.sign({ userId }, secret, {
    expiresIn: "7d",
  });
};

export const authenticate = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const isMatch = await existingUser.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid password",
        });
      }

      const userId = (existingUser._id as Types.ObjectId).toString();
      const token = generateToken(userId);

      return res.json({
        message: "Login successful",
        token,
        user: {
          id: existingUser._id,
          email: existingUser.email,
          teamId: existingUser.teamId || null,
        },
        isNewUser: false,
      });
    } else {
      const newUser = new User({ email, password });
      await newUser.save();

      const userId = (newUser._id as Types.ObjectId).toString();
      const token = generateToken(userId);

      try {
        await createTeamForUser(userId);

        const updatedUser = await User.findById(userId);

        return res.status(201).json({
          message: "Registration successful and team created",
          token,
          user: {
            id: updatedUser!._id,
            email: updatedUser!.email,
            teamId: updatedUser!.teamId || null,
          },
          isNewUser: true,
        });
      } catch (teamError) {
        console.error("Team creation error:", teamError);
        return res.status(201).json({
          message:
            "Registration successful. Team creation failed, please try again later.",
          token,
          user: {
            id: newUser._id,
            email: newUser.email,
            teamId: null,
          },
          isNewUser: true,
        });
      }
    }
  } catch (error) {
    console.error("Authentication error:", error);

    if ((error as any).code === 11000) {
      return res.status(400).json({
        message: "User already exists with this email address",
      });
    }

    res.status(500).json({
      message: "Server error during authentication. Please try again.",
    });
  }
};

export const register = async (req: Request, res: Response) => {
  return authenticate(req, res);
};

export const login = async (req: Request, res: Response) => {
  return authenticate(req, res);
};
