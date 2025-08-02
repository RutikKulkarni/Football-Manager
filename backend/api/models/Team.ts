import mongoose, { type Document, Schema } from "mongoose";

export interface ITeam extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  budget: number;
  players: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema<ITeam>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
      maxlength: [50, "Team name cannot exceed 50 characters"],
    },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
      default: 5000000,
      min: [0, "Budget cannot be negative"],
    },
    players: [
      {
        type: Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
  },
  {
    timestamps: true,
  }
);

teamSchema.index({ userId: 1 });
teamSchema.index({ name: 1 });

teamSchema.virtual("playerCount", {
  ref: "Player",
  localField: "_id",
  foreignField: "teamId",
  count: true,
});

teamSchema.set("toJSON", { virtuals: true });

export default mongoose.model<ITeam>("Team", teamSchema);
