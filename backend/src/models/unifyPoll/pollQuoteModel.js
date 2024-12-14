import { pollTypeConst } from "../typeConstant";
import basePollModel from "./basePollModel";

export const pollQuoteSchema = new Schema({
  question: { type: String, required: true, trim: true }, // for poll and quotes
  ansArray: [
    {
      ans: { type: String, required: true, trim: true },
      count: { type: Number, default: 0 },
      userPhoto: { type: String, trim: true },
    },
  ],
  expiresAt: { type: Date },
});

export const pollModel = basePollModel.discriminator(
  pollTypeConst.POLL,
  pollQuoteSchema
);
export const quoteModel = basePollModel.discriminator(
  pollTypeConst.QUOTE,
  pollQuoteSchema
);
