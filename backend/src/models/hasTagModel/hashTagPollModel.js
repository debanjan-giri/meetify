import { Schema, model } from "mongoose";

const hashTagPollSchema = new Schema({
  question: { type: String, required: true },
  contentType: {
    type: String,
    default: "tagPoll",
    required: true,
    enum: ["tagPoll"],
  },

  ansArray: [
    {
      text: { type: String, required: true },
      count: { type: Number, default: 0 },
      enum: ["Happy", "Stressed", "Normal", "agree", "disagree", "yes", "no"],
      submitedByIds: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
    },
  ],
});

const hashTagPollModel = model("hashTagPollModel", hashTagPollSchema);

export default hashTagPollModel;
