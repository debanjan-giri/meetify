import { Schema, model } from "mongoose";
import {
  contentTypeConst,
  pollTypeConst,
  systemContentConst,
} from "../../constant/typeConstant";

const basePollSchema = new Schema({
  pollType: {
    type: String,
    enum: Object.values(pollTypeConst),
    required: true,
    index: true,
  },
  contentType: {
    type: String,
    enum: [
      contentTypeConst.CONTENT,
      contentTypeConst.COMMUNITY,
      systemContentConst,
    ],
    default: contentTypeConst.CONTENT,
    index: true,
    required: true,
  },
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: "baseUserModel",
    required: true,
    index: true,
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },

  question: { type: String, required: true, trim: true },
  ansArray: [
    {
      ans: { type: String, trim: true },
      count: { type: Number, default: 0 },
      userId: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
    },
  ],
});

basePollSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const basePollModel = model("basePollModel", basePollSchema);
export default basePollModel;
