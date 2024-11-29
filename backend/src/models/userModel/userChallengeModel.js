import { Schema, model } from "mongoose";

// Model to track user challenge participation and submission
const userChallengeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  challenge: { type: Schema.Types.ObjectId, ref: "VirtualChallenge", required: true },
  acceptedAt: { type: Date, default: Date.now },
  submitted: { type: Boolean, default: false },  // Track whether the user has submitted their response
  submissionData: { type: Schema.Types.Mixed },  // Store the user's submission (photo/video/text)
  status: {
    type: String,
    enum: ["pending", "submitted", "completed"],
    default: "pending",
  },
  visibility: { type: String, enum: ["public", "private"], default: "public" },  // For privacy control
});

export default model("UserChallenge", userChallengeSchema);
