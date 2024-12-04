import { Schema, model } from "mongoose";

const hashTagPostSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  photoUrl: [{ type: String }],
  contentType: {
    type: String,
    default: "tagPost",
    required: true,
  },
  totalLike: { type: Number, default: 0 },
  likedArray: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
      likeType: {
        type: String,
        enum: ["wow", "like", "funny", "happy"],
        default: "happy",
      },
    },
  ],
  commentsArray: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "baseUserModel",
        required: true,
      },
      comment: { type: String, required: true },
      totalLike: { type: Number, default: 0 },
      likedByIds: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const hashTagPostModel = model("hashTagPostModel", hashTagPostSchema);
export default hashTagPostModel;
