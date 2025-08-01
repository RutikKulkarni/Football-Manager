import mongoose, { type Document, Schema } from "mongoose";

export enum PlayerPosition {
  GOALKEEPER = "Goalkeeper",
  DEFENDER = "Defender",
  MIDFIELDER = "Midfielder",
  ATTACKER = "Attacker",
}

export interface IPlayer extends Document {
  name: string;
  position: PlayerPosition;
  teamId: mongoose.Types.ObjectId;
  value: number;
  isOnTransferList: boolean;
  askingPrice?: number;
  createdAt: Date;
}

const playerSchema = new Schema<IPlayer>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: String,
    enum: Object.values(PlayerPosition),
    required: true,
  },
  teamId: {
    type: Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  value: {
    type: Number,
    required: true,
    min: 0,
  },
  isOnTransferList: {
    type: Boolean,
    default: false,
  },
  askingPrice: {
    type: Number,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IPlayer>("Player", playerSchema);
