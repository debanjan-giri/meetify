import { Schema, model } from "mongoose";

const contentSchema = new Schema({
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: "userModel",
    required: true,
  },
  contentType: {
    type: String,
    enum: [
      contentTypeConst.POST,
      contentTypeConst.STATUS,
      contentTypeConst.CHALLENGE,
      contentTypeConst.COMMUNITY,
      contentTypeConst.CAPSULE,
    ],
    required: true,
    index: true,
  },
  privacyType: {
    type: String,
    enum: [privacyTypeConst.PUBLIC, privacyTypeConst.FRIENDS],
    default: privacyTypeConst.PUBLIC,
    index: true,
  },
  title: { type: String, required: true, lowercase: true, trim: true },
  photoUrl: { type: String, trim: true },

  isReported: {
    type: Number,
    default: zeroOneTypeConst.ZERO,
    enum: [zeroOneTypeConst.ZERO, zeroOneTypeConst.ONE],
  },

  reported: { type: Schema.Types.ObjectId, ref: "reportModel" },
  likes: { type: Schema.Types.ObjectId, ref: "likeModel" },
  comments: { type: Schema.Types.ObjectId, ref: "commentModel" },
  views: { type: Schema.Types.ObjectId, ref: "viewsModel" },

  expireTime: {
    type: Number,
    enum: [
      expireTypeConst.NONE,
      expireTypeConst.ONE,
      expireTypeConst.SEVEN,
      expireTypeConst.THIRTY,
    ],
    default: expireTypeConst.NONE,
  },

  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

contentModel.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const contentModel = model("contentModel", contentSchema);

export default contentModel;
