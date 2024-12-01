import { Schema, model } from "mongoose";

const baseFeedPollSchema = new Schema(
  {
    contentType: [
      {
        type: String,
        enum: ["poll", "qoute"],
        required: true,
      },
    ],

    title: { type: String },
    options: [
      {
        text: { type: String, required: true },
        count: { type: Number, default: 0 },
      },
    ],

    submitedById: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
        ans: { type: String },
      },
    ],
    reported: {
      type: Boolean,
      default: false,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { discriminatorKey: "contentType", timestamps: true }
);

const baseFeedPollModel = model("baseFeedPollModel", baseFeedPollSchema);
export default baseFeedPollModel;
