import { Schema, model } from "mongoose";
import {
  contentTypeConst,
  likeTypeConst,
  privacyTypeConst,
} from "../typeConstant.js";

const baseMediaSchema = new Schema({
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: "baseUserModel",
    required: true,
  },
  contentType: {
    type: String,
    enum: Object.values(contentTypeConst),
    required: true,
    index: true,
  },
  privacyType: {
    type: String,
    enum: Object.values(privacyTypeConst),
    default: privacyTypeConst.PUBLIC,
  },
  customPrivacyIds: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
  title: { type: String, required: true, trim: true },
  photoUrl: { type: String, trim: true },
  totalLike: { type: Number, default: 0 },
  likedArray: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
      likeType: {
        type: String,
        enum: Object.values(likeTypeConst),
        default: likeTypeConst.LIKE,
      },
    },
  ],
  description: { type: String, trim: true },
  commentArray: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
      comment: { type: String, trim: true },
      totalLike: { type: Number, default: 0 },
      likedByIds: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
      createdAt: { type: Date, default: Date.now, index: true },
    },
  ],
  isHashTaged: {
    hastagId: { type: Schema.Types.ObjectId, ref: "hashTagListModel" },
  },

  isReported: { type: Boolean, default: false, enum: [true, false] },
  reportedArray: {
    creatorEmail: { type: String, trim: true },
    reportedByEmail: { type: String, trim: true },
  },

  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});

baseMediaSchema.pre("save", function (next) {
  if (
    this.contentType.includes(contentTypeConst.STATUS) ||
    this.contentType.includes(contentTypeConst.CHALLENGE)
  ) {
    this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  } else {
    this.expiresAt = null;
  }
  next();
});

// mongodb TTL index
baseMediaSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const baseMediaModel = model("baseMediaModel", baseMediaSchema);

export default baseMediaModel;
