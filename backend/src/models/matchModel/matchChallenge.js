import { Schema } from "mongoose";
import baseMatchModel from "./baseMatchModel";

const matchChallengeSchema = new Schema({
  title: { type: String },
  description: { type: String },
  photoUrl: { type: String },
  likedById: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
  likesEnum: {
    type: String,
    enum: ["wow", "like", "funny", "happy"],
    default: "happy",
  },
  commentsById: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const matchChallengeModel = baseMatchModel.discriminator(
  "challenge",
  matchChallengeSchema
);

export default matchChallengeModel;
