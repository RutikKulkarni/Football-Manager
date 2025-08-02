import type { Response } from "express";
import Team from "../models/Team";
import Player from "../models/Player";
import { createTeamForUser } from "../services/teamService";
import type { AuthRequest } from "../middleware/auth";

export const getTeam = async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user as { _id: string })?._id;
    let team = await Team.findOne({ userId }).populate("players");

    if (!team) {
      try {
        const result = await createTeamForUser(userId.toString());
        team = "team" in result ? result.team : result;
      } catch (error) {
        console.error("Error creating team:", error);
        return res.status(404).json({
          message:
            "Team not found and could not be created. Please try again later.",
        });
      }
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
