import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    userName: { type: String, required: true },
    password: { type: String, required: true }, // Store hashed passwords
    bio: { type: String },
    skills: [String], // Array of skills
    interests: [String], // Array of interests
    achievements: [String], // Array of achievement descriptions
    profilePicture: { type: String }, // URL to profile picture
    totalLikes: { type: Number, default: 0 },
    totalComments: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    moodHistory: [
      { date: { type: Date, default: Date.now }, mood: { type: String } },
    ],
    groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
  },
  {
    timestamps: true,
  }
);

export default model("user", userSchema);
