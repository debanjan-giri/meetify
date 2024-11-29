import { Schema, model } from "mongoose";

const matchmakingSchema = new Schema({
  user1: { type: Schema.Types.ObjectId, ref: "User", required: true }, // First user in the match
  user2: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Second user in the match
  status: {
    type: String,
    enum: ["matched", "accepted", "rejected", "revealed"],
    default: "matched",
  },
  revealed: { type: Boolean, default: false }, // Whether both users have revealed their identities
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default model("Matchmaking", matchmakingSchema);
