import { Schema, model } from "mongoose";
import baseHashTagModel from "./baseHashTagModel";

const hashTagPollSchema = new Schema({
  question: { type: String },
  photoUrl: { type: String },
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

const hashTagPollModel = baseHashTagModel.discriminator(
  "poll",
  hashTagPollSchema
);
export default hashTagPollModel;
