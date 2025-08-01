import Team from "../models/Team";
import Player, { PlayerPosition } from "../models/Player";
import User from "../models/User";
import { teamCreationQueue } from "./queueService";
import { Types } from "mongoose";

export const createTeamJob = async (userId: string) => {
  await teamCreationQueue.add("createTeam", { userId });
};

export const createTeamForUser = async (userId: string) => {
  try {
    console.log(`Creating team for user: ${userId}`);

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const team = new Team({
      userId,
      name: `Team ${user.email.split("@")[0]}`,
      budget: 5000000,
    });

    await team.save();

    // Define the player interface to match your Player model
    interface PlayerData {
      name: string;
      position: PlayerPosition;
      teamId: Types.ObjectId;
      value: number;
    }

    const players: PlayerData[] = [];

    const generatePlayer = (
      position: PlayerPosition,
      index: number
    ): PlayerData => ({
      name: `${position} ${index + 1}`,
      position,
      teamId: team._id as Types.ObjectId,
      value: Math.floor(Math.random() * 1000000) + 100000,
    });

    for (let i = 0; i < 3; i++) {
      players.push(generatePlayer(PlayerPosition.GOALKEEPER, i));
    }

    for (let i = 0; i < 6; i++) {
      players.push(generatePlayer(PlayerPosition.DEFENDER, i));
    }

    for (let i = 0; i < 6; i++) {
      players.push(generatePlayer(PlayerPosition.MIDFIELDER, i));
    }

    for (let i = 0; i < 5; i++) {
      players.push(generatePlayer(PlayerPosition.ATTACKER, i));
    }

    await Player.insertMany(players);

    user.teamId = team._id as Types.ObjectId;
    await user.save();

    console.log(`Team created successfully for user: ${userId}`);
  } catch (error) {
    console.error(`Error creating team for user ${userId}:`, error);
    throw error;
  }
};
