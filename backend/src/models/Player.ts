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
  updatedAt: Date;
}

const playerSchema = new Schema<IPlayer>(
  {
    name: {
      type: String,
      required: [true, "Player name is required"],
      trim: true,
      maxlength: [50, "Player name cannot exceed 50 characters"],
    },
    position: {
      type: String,
      enum: {
        values: Object.values(PlayerPosition),
        message:
          "Position must be one of: Goalkeeper, Defender, Midfielder, Attacker",
      },
      required: [true, "Player position is required"],
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Team ID is required"],
    },
    value: {
      type: Number,
      required: [true, "Player value is required"],
      min: [0, "Player value cannot be negative"],
    },
    isOnTransferList: {
      type: Boolean,
      default: false,
    },
    askingPrice: {
      type: Number,
      min: [0, "Asking price cannot be negative"],
      validate: {
        validator: function (this: IPlayer, value: number) {
          if (this.isOnTransferList && !value) {
            return false;
          }
          return true;
        },
        message: "Asking price is required when player is on transfer list",
      },
    },
  },
  {
    timestamps: true,
  }
);

playerSchema.index({ teamId: 1 });
playerSchema.index({ position: 1 });
playerSchema.index({ isOnTransferList: 1 });
playerSchema.index({ value: 1 });
playerSchema.index({ askingPrice: 1 });

playerSchema.index({ isOnTransferList: 1, askingPrice: 1 });
playerSchema.index({ teamId: 1, position: 1 });

playerSchema.virtual("team", {
  ref: "Team",
  localField: "teamId",
  foreignField: "_id",
  justOne: true,
});

playerSchema.set("toJSON", { virtuals: true });

export default mongoose.model<IPlayer>("Player", playerSchema);
