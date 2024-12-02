import { Schema, model } from "mongoose";

const baseSubmitSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "baseUserModel",
      required: true,
    },
    userType: {
      type: String,
      enum: ["hr", "employee", "admin"],
      default: "employee",
      required: true,
    },

    contentType: [
      {
        type: String,
        enum: ["post", "status", "challenge"],
        required: true,
      },
    ],
    title: { type: String },
    description: { type: String },
    photoUrl: { type: String },
    likeCount: { type: Number, default: 0 },
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

const baseSubmitModel = model("baseSubmitModel", baseSubmitSchema);

export default baseSubmitModel;
