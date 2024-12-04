import { Schema, model } from "mongoose";

const baseMatchSchema = new Schema(
  {
    userId1: {
      type: Schema.Types.ObjectId,
      ref: "baseUserModel",
      required: true,
    },
    userId2: {
      type: Schema.Types.ObjectId,
      ref: "baseUserModel",
      required: true,
    },
    isMatched: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["pending", "revealed", "rejected"],
      default: "pending",
    },

    // if both users action type are matched
    actionType: {
      type: String,
      enum: ["chat", "challenge", "like", "Next Time"],
      default: "like",
    },
    likedById: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: Date.now + 7 * 60 * 60 * 1000 },
    title: { type: String },
    description: { type: String },
    photoUrl: { type: String },
    likedById: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
    likesEnum: {
      type: String,
      enum: ["wow", "like", "funny", "happy"],
      default: "happy",
    },
    comments: {
      userId: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  },
  { discriminatorKey: "actionType", timestamps: true }
);

const baseMatchModel = model("baseMatchModel", baseMatchSchema);
export default baseMatchModel;
