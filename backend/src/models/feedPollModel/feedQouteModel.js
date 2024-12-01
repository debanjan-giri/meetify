import { Schema } from "mongoose";
import baseFeedPollModel from "./baseFeedPollModel";

const feedQuoteSchema = new Schema({
  optionsEnum: {
    type: String,
    enum: ["yes", "no", "agree", "disagree"],
    default: "yes",
  },
  expiresAt: { type: Date, default: Date.now + 24 * 60 * 60 * 1000 },
});

feedQuoteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const feedQouteModel = baseFeedPollModel.discriminator(
  "qoute",
  feedQuoteSchema
);

export default feedQouteModel;
