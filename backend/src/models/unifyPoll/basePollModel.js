import { Schema, model } from "mongoose";
import {
  pollAnsTypeConst,
  pollTypeConst,
  userTypeConst,
} from "../typeConstant.js";

const basePollSchema = new Schema(
  {
    pollType: {
      type: String,
      enum: Object.values(pollTypeConst),
      required: true,
      index: true,
    },
    creatorType: {
      type: String,
      enum: Object.values(userTypeConst),
      default: userTypeConst.EMPLOYEE,
      index: true,
      required: true,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "baseUserModel",
      required: true,
    },
    question: { type: String, required: true, trim: true },
    ansArray: [
      {
        ansType: {
          type: String,
          enum: Object.values(pollAnsTypeConst),
          required: true,
        },
        userIds: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
        count: { type: Number, default: 0 },
      },
    ],
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    timer: {
      type: Number,
      min: 1,
    },
  },
  { discriminatorKey: "contentType", timestamps: true }
);

basePollSchema.pre("save", function (next) {
  // set timer for quiz
  if (this.contentType === pollTypeConst.QUIZ) {
    if (!this.timer || this.timer <= 0) {
      this.timer = 300;
    }
  }

  // Set expiresAt for system polls
  if (
    this.contentType === pollTypeConst.POLL ||
    this.contentType === pollTypeConst.QUOTE
  ) {
    const oneDayInMs = 24 * 60 * 60 * 1000;
    this.expiresAt = new Date(this.createdAt.getTime() + oneDayInMs);
  }

  next();
});

basePollSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const basePollModel = model("basePollModel", basePollSchema);
export default basePollModel;
