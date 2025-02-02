import { Schema, model } from "mongoose";

const capsuleSchema = new Schema({
  creatorId: { type: Schema.Types.ObjectId, ref: "userModel" },
  contentId: { type: Schema.Types.ObjectId, ref: "contentModel" },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  isOpened: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
});

capsuleSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const capsuleModel = model("capsuleModel", capsuleSchema);

export default capsuleModel;
