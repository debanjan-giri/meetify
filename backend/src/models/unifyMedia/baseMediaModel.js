import { Schema, model } from "mongoose";

const baseContentSchema = new Schema({
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
  photoUrl: { type: String },
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

  description: { type: String },
  commentsArray: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
      comment: { type: String },
      totalLike: { type: Number, default: 0 },
      likedByIds: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
      createdAt: { type: Date, default: Date.now, index: true },
    },
  ],
  isHashTaged: {
    hastagId: { type: Schema.Types.ObjectId, ref: "hashTagListModel" },
    validate: {
      validator: function (value) {
        if (
          (this.contentType.includes("status") ||
            this.contentType.includes("challenge")) &&
          value != null
        ) {
          return false;
        }
        return true;
      },
      message: "Cannot add hashtags to status or challenge content types.",
    },
  },

  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});

baseContentSchema.pre("save", function (next) {
  if (
    this.contentType.includes("status") ||
    this.contentType.includes("challenge")
  ) {
    this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  } else {
    this.expiresAt = null;
  }
  next();
});

// mongodb TTL index
baseContentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const baseContentModel = model("baseContentModel", baseContentSchema);

export default baseContentModel;
