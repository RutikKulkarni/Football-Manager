import mongoose, { type Document, Schema } from "mongoose";

export interface ITeam extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  budget: number;
  players: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const teamSchema = new Schema<ITeam>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  budget: {
    type: Number,
    required: true,
    default: 5000000,
  },
  players: [
    {
      type: Schema.Types.ObjectId,
      ref: "Player",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ITeam>("Team", teamSchema);
