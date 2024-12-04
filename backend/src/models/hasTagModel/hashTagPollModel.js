import { Schema, model } from "mongoose";

const hashTagPollSchema = new Schema({
  question: { type: String },
  contentType: [
    {
      type: String,
      enum: ["tagPoll"],
      required: true,
    },
  ],
  options: [
    {
      text: { type: String, required: true },
      count: { type: Number, default: 0 },
    },
  ],
  optionsEnum: {
    type: String,
    enum: ["Happy", "Stressed", "Normal", "agree", "disagree", "yes", "no"],
    default: "Normal",
  },

  submitedById: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
      reactionType: { type: String },
    },
  ],
});

const hashTagPollModel = model("hashTagPollModel", hashTagPollSchema);

export default hashTagPollModel;
