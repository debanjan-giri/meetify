import { Schema, model } from "mongoose";

const baseContentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "baseUserModel",
      required: true,
    },

    contentType: [
      {
        type: String,
        enum: ["post", "status", "challenge"],
        required: true,
      },
    ],

    privacyType: {
      type: String,
      enum: ["public", "friends", "selected"],
      default: "public",
    },

    selectedPrivacyIds: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],

    title: { type: String },
    description: { type: String },
    photoUrl: { type: String },
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

    commentsById: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
        comment: { type: String },
        likes: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
        createdAt: { type: Date, default: Date.now },
      },
    ],
    hashTagId: { type: Schema.Types.ObjectId, ref: "hashTagListModel" },
    privacy: {
      type: String,
      enum: ["public", "friends", "selected"],
      default: "public",
    },
    reported: {
      type: Boolean,
      default: false,
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    discriminatorKey: "contentType",
    timestamps: true,
  }
);

const baseContentModel = model("baseContentModel", baseContentSchema);

export default baseContentModel;
