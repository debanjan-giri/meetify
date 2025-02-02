import { Schema, model } from "mongoose";

const pollSchema = new Schema({
  pollType: {
    type: String,
    enum: [pollTypeConst.POLL, pollTypeConst.QUOTE],
    required: true,
    index: true,
  },
  contentType: {
    type: String,
    enum: [contentTypeConst.CONTENT, contentTypeConst.COMMUNITY],
    index: true,
    required: true,
  },
  creatorId: { type: Schema.Types.ObjectId, ref: "userModel", required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: 24 * 60 * 60 * 1000 },

  question: { type: String, required: true, trim: true },
  ansArray: [
    {
      ans: { type: String, trim: true, required: true },
      ansIndex: { type: Number, required: true },
      totalCount: { type: Number, default: 0 },
      userId: [{ type: Schema.Types.ObjectId, ref: "userModel" }],
    },
  ],
});

pollSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const pollModel = model("pollModel", pollSchema);
export default pollModel;
