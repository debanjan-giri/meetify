import { Schema, model } from "mongoose";

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
    index: true,
  },
  title: { type: String, required: true, trim: true },
  photoUrl: { type: String, trim: true },

  isReported: { type: Boolean, default: false, enum: [true, false] },
  reportedDetails: {
    reportedByName: { type: String, trim: true },
    reportedByEmail: { type: String, trim: true },
  },

  likes: { type: Schema.Types.ObjectId, ref: "likeModel" },
  comments: { type: Schema.Types.ObjectId, ref: "commentModel" },
  views: { type: Schema.Types.ObjectId, ref: "viewModel", unique: true },

  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

// mongodb TTL index
baseMediaSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const baseContentModel = model("baseContentModel", baseMediaSchema);

export default baseContentModel;
