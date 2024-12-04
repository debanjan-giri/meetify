import { Schema, model } from "mongoose";

const hashTagPostSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  photoUrl: { type: String },
  contentType: [
    {
      type: String,
      enum: ["tagPost"],
      required: true,
    },
  ],
  likeCount: { type: Number, default: 0 },
  likedById: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
      likeType: {
        type: String,
        enum: ["wow", "like", "funny", "happy"],
        default: "happy",
      },
    },
  ],
  comments: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "baseUserModel",
        required: true,
      },
      comment: { type: String, required: true },
      likeCount: { type: Number, default: 0 },
      likedId: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const hashTagPostModel = model("hashTagPostModel", hashTagPostSchema);
export default hashTagPostModel;
