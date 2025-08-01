import type { Response } from "express";
import mongoose, { Types } from "mongoose";
import Player from "../models/Player";
import Team from "../models/Team";
import type { AuthRequest } from "../middleware/auth";

export const getTransferMarket = async (req: AuthRequest, res: Response) => {
  try {
    const { teamName, playerName, minPrice, maxPrice } = req.query;

    const query: any = { isOnTransferList: true };

    if (minPrice || maxPrice) {
      query.askingPrice = {};
      if (minPrice) query.askingPrice.$gte = Number(minPrice);
      if (maxPrice) query.askingPrice.$lte = Number(maxPrice);
    }

    if (playerName) {
      query.name = { $regex: playerName, $options: "i" };
    }

    let players = await Player.find(query).populate("teamId", "name");

    if (teamName) {
      players = players.filter((player) =>
        (player.teamId as any).name
          .toLowerCase()
          .includes((teamName as string).toLowerCase())
      );
    }

    res.json(players);
  } catch (error) {
    console.error("Get transfer market error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addPlayerToTransferList = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { playerId } = req.params;
    const { askingPrice } = req.body;

    const userTeam = await Team.findOne({ userId: req.user!._id });
    if (!userTeam) {
      return res.status(404).json({ message: "Team not found" });
    }

    const player = await Player.findOne({
      _id: playerId,
      teamId: userTeam._id,
    });
    if (!player) {
      return res
        .status(404)
        .json({ message: "Player not found or not owned by you" });
    }

    const teamPlayersCount = await Player.countDocuments({
      teamId: userTeam._id,
    });
    if (teamPlayersCount <= 15) {
      return res.status(400).json({
        message: "Cannot list player. Team must have at least 15 players.",
      });
    }

    player.isOnTransferList = true;
    player.askingPrice = askingPrice;
    await player.save();

    res.json({ message: "Player added to transfer list", player });
  } catch (error) {
    console.error("Add to transfer list error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removePlayerFromTransferList = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { playerId } = req.params;

    const userTeam = await Team.findOne({ userId: req.user!._id });
    if (!userTeam) {
      return res.status(404).json({ message: "Team not found" });
    }

    const player = await Player.findOne({
      _id: playerId,
      teamId: userTeam._id,
    });
    if (!player) {
      return res
        .status(404)
        .json({ message: "Player not found or not owned by you" });
    }

    player.isOnTransferList = false;
    player.askingPrice = undefined;
    await player.save();

    res.json({ message: "Player removed from transfer list", player });
  } catch (error) {
    console.error("Remove from transfer list error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const buyPlayer = async (req: AuthRequest, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { playerId } = req.params;

    const buyerTeam = await Team.findOne({ userId: req.user!._id }).session(
      session
    );
    if (!buyerTeam) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Your team not found" });
    }

    const player = await Player.findOne({
      _id: playerId,
      isOnTransferList: true,
    }).session(session);

    if (!player) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ message: "Player not available for transfer" });
    }

    const buyerTeamId = buyerTeam._id as Types.ObjectId;

    if (player.teamId.equals(buyerTeamId)) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Cannot buy your own player" });
    }

    const sellerTeam = await Team.findById(player.teamId).session(session);
    if (!sellerTeam) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Seller team not found" });
    }

    const buyPrice = Math.floor(player.askingPrice! * 0.95);

    if (buyerTeam.budget < buyPrice) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient budget" });
    }

    const buyerPlayersCount = await Player.countDocuments({
      teamId: buyerTeam._id,
    }).session(session);
    const sellerPlayersCount = await Player.countDocuments({
      teamId: sellerTeam._id,
    }).session(session);

    if (buyerPlayersCount >= 25) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: "Cannot exceed 25 players in team" });
    }

    if (sellerPlayersCount <= 15) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: "Seller team cannot go below 15 players" });
    }

    buyerTeam.budget -= buyPrice;
    sellerTeam.budget += buyPrice;

    player.teamId = buyerTeamId;
    player.isOnTransferList = false;
    player.askingPrice = undefined;

    await buyerTeam.save({ session });
    await sellerTeam.save({ session });
    await player.save({ session });

    await session.commitTransaction();

    res.json({
      message: "Player purchased successfully",
      player,
      pricePaid: buyPrice,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Buy player error:", error);
    res.status(500).json({ message: "Server error during transfer" });
  } finally {
    session.endSession();
  }
};
