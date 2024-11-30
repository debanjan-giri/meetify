import { Schema, model } from "mongoose";

const submitSchema = new Schema({
  // user
  creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  creatorType: {
    type: String,
    enum: ["hr", "employee", "admin"],
    default: "employee",
  },

  // type of content
  contentType: [
    {
      type: String,
      enum: ["post", "story", "challenge"],
      required: true,
    },
  ],

  // content
  title: { type: String },
  description: { type: String },
  photoUrl: { type: String },
  likeCount: { type: Number, default: 0 },
  likedById: [{ type: Schema.Types.ObjectId, ref: "User" }],
  likesEnum: {
    type: String,
    enum: ["wow", "like", "funny", "happy"],
    default: "happy",
  },
  commentsById: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],

  // challenge
  challengeId: {
    type: Schema.Types.ObjectId,
    ref: "challenge",
    required: true,
  },

  // modaration
  visibilityId: [{ type: Schema.Types.ObjectId, ref: "User" }],
  reported: {
    type: Boolean,
    default: false,
  },

  // date
  createdAt: { type: Date, default: Date.now },
  expiredAt: { type: Date, default: Date.now + 30 * 24 * 60 * 60 * 1000 },
});

// Add TTL index
submitSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

export default model("submitModel", submitSchema);
