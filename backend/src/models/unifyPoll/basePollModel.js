import { Schema, model } from "mongoose";
import {
  contentTypeConst,
  pollTypeConst,
  systemContentConst,
} from "../typeConstant.js";

const basePollSchema = new Schema(
  {
    pollType: {
      type: String,
      enum: Object.values(pollTypeConst),
      required: true,
      index: true,
    },
    contentType: {
      type: String,
      enum: Object.values(contentTypeConst),
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
    isReported: { type: Boolean, default: false, enum: [true, false] },
    reportedArray: {
      creatorEmail: { type: String, trim: true },
      reportedByEmail: { type: String, trim: true },
    },
    createdAt: { type: Date, default: Date.now },
  },
  { discriminatorKey: "contentType", timestamps: true }
);

basePollSchema.pre("save", function (next) {
  const oneDayInMs = 24 * 60 * 60 * 1000;
  const isOldPoll =
    new Date().getTime() - this.createdAt.getTime() > oneDayInMs;

  // 1. system created mood poll ansArray will be deleted after 24 hours
  if (this.contentType === systemContentConst && isOldPoll) {
    this.ansArray = [];
  }

  //2. user createad poll will delete after 7 days
  const thirtyDaysInMs = 7 * 24 * 60 * 60 * 1000;
  const isOldPollForDeletion =
    new Date().getTime() - this.createdAt.getTime() > thirtyDaysInMs;

  if (this.contentType !== systemContentConst && isOldPollForDeletion) {
    return this.remove();
  }
  next();
});

basePollSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const basePollModel = model("basePollModel", basePollSchema);
export default basePollModel;
