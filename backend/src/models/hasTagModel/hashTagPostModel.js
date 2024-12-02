import { Schema, model } from "mongoose";
import baseHashTagModel from "./baseHashTagModel";

const hashTagPostSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  photoUrl: { type: String },
  likeCount: { type: Number, default: 0 },
  likedById: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
  likesEnum: {
    type: String,
    enum: ["wow", "like", "funny", "happy"],
    default: "happy",
  },
  comments: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "baseUserModel", required: true },
      text: { type: String, required: true },
      likes: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const hashTagPostModel = baseHashTagModel.discriminator(
  "post",
  hashTagPostSchema
);
export default hashTagPostModel;
