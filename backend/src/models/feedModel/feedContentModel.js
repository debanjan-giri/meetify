import { Schema, model } from "mongoose";

const baseContentSchema = new Schema(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "baseUserModel",
      required: true,
    },

    contentType: [
      {
        type: String,
        enum: ["content", "status", "challenge"],
        required: true,
      },
    ],

    privacyType: {
      type: String,
      enum: ["public", "friends", "custom"],
      default: "public",
    },

    customPrivacyIds: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],

    title: { type: String, required: true },
    description: { type: String },
    photoUrl: { type: String },
    likeCount: { type: Number, default: 0 },
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
        userId: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
        comment: { type: String },
        totalLike: { type: Number, default: 0 },
        likedByIds: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
        createdAt: { type: Date, default: Date.now, index: true },
      },
    ],
    isAddHashTag: { type: Schema.Types.ObjectId, ref: "hashTagListModel" },

    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
  },
  {
    discriminatorKey: "contentType",
    timestamps: true,
  }
);

baseContentModel.pre("save", function (next) {
  if (this.contentType === "status" && !this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
  next();
});

baseContentModel.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const baseContentModel = model("baseContentModel", baseContentSchema);

export default baseContentModel;
