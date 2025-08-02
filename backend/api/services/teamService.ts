import Team from "../models/Team";
import Player, { PlayerPosition } from "../models/Player";
import User from "../models/User";
import type { Types } from "mongoose";

const generateSimplePlayerName = (
  position: PlayerPosition,
  index: number
): string => {
  const positionPrefix = {
    [PlayerPosition.GOALKEEPER]: "GK",
    [PlayerPosition.DEFENDER]: "DEF",
    [PlayerPosition.MIDFIELDER]: "MID",
    [PlayerPosition.ATTACKER]: "ATT",
  };

  return `${positionPrefix[position]} Player ${index + 1}`;
};

const getRandomTeamName = (userEmail: string): string => {
  const userPrefix = userEmail.split("@")[0];
  return `${userPrefix} FC`;
};

const generatePlayerValue = (position: PlayerPosition): number => {
  const baseValues = {
    [PlayerPosition.GOALKEEPER]: { min: 500000, max: 2000000 },
    [PlayerPosition.DEFENDER]: { min: 800000, max: 3000000 },
    [PlayerPosition.MIDFIELDER]: { min: 1000000, max: 4000000 },
    [PlayerPosition.ATTACKER]: { min: 1200000, max: 5000000 },
  };

  const range = baseValues[position];
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
};

export const createTeamForUser = async (userId: string) => {
  try {
    console.log(`Creating team for user: ${userId}`);

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const existingTeam = await Team.findOne({ userId });
    if (existingTeam) {
      console.log(`Team already exists for user: ${userId}`);
      return existingTeam;
    }

    const team = new Team({
      userId,
      name: getRandomTeamName(user.email),
      budget: 5000000,
    });

    await team.save();

    interface PlayerData {
      name: string;
      position: PlayerPosition;
      teamId: Types.ObjectId;
      value: number;
    }

    const players: PlayerData[] = [];

    const playerDistribution = [
      { position: PlayerPosition.GOALKEEPER, count: 3 },
      { position: PlayerPosition.DEFENDER, count: 6 },
      { position: PlayerPosition.MIDFIELDER, count: 6 },
      { position: PlayerPosition.ATTACKER, count: 5 },
    ];

    for (const { position, count } of playerDistribution) {
      for (let i = 0; i < count; i++) {
        players.push({
          name: generateSimplePlayerName(position, i),
          position,
          teamId: team._id as Types.ObjectId,
          value: generatePlayerValue(position),
        });
      }
    }

    const createdPlayers = await Player.insertMany(players);

    team.players = createdPlayers.map((player) => player._id as Types.ObjectId);
    await team.save();

    user.teamId = team._id as Types.ObjectId;
    await user.save();

    console.log(
      `Team "${team.name}" created successfully for user: ${userId} with ${createdPlayers.length} players`
    );

    return {
      team,
      players: createdPlayers,
    };
  } catch (error) {
    console.error(`Error creating team for user ${userId}:`, error);
    throw error;
  }
};
