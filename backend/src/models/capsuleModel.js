import { Schema, model } from "mongoose";

const capsuleSchema = new Schema({
  creatorId: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
  contentId: { type: Schema.Types.ObjectId, ref: "baseContentModel" },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

capsuleSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const capsuleModel = model("capsuleModel", capsuleSchema);

export default capsuleModel;
