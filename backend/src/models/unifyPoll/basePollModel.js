import { Schema, model } from "mongoose";

const basePollSchema = new Schema(
  {
    contentType: [
      {
        type: String,
        enum: ["poll", "qoute", "quiz"],
        required: true,
      },
    ],
    creatorType: {
      type: String,
      enum: ["hr", "admin", "system", "employee"],
      default: "admin",
    },
    creatorId: { type: Schema.Types.ObjectId, ref: "User" },

    question: { type: String },
    ansArray: [
      {
        ansType: {
          type: String,
          required: true,
          enum: ["Happy", "Stressed", "Normal", "yes", "no"],
        },
        submitedByIds: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
        count: { type: Number, default: 0 },
      },
    ],
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
  },
  { discriminatorKey: "contentType", timestamps: true }
);

const baseFeedPollModel = model("baseFeedPollModel", baseFeedPollSchema);
export default baseFeedPollModel;
