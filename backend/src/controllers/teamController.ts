import type { Response } from "express";
import Team from "../models/Team";
import Player from "../models/Player";
import type { AuthRequest } from "../middleware/auth";

export const getTeam = async (req: AuthRequest, res: Response) => {
  try {
    const team = await Team.findOne({ userId: req.user!._id }).populate(
      "players"
    );

    if (!team) {
      return res.status(404).json({
        message: "Team not found. Team creation may still be in progress.",
      });
    }

    res.json(team);
  } catch (error) {
    console.error("Get team error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTeamPlayers = async (req: AuthRequest, res: Response) => {
  try {
    const team = await Team.findOne({ userId: req.user!._id });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const players = await Player.find({ teamId: team._id });

    res.json(players);
  } catch (error) {
    console.error("Get team players error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
