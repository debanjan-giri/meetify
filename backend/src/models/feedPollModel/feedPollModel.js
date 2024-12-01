import { Schema } from "mongoose";
import baseFeedPollModel from "./baseFeedPollModel";

const feedPollSchema = new Schema({
  creatorType: {
    type: String,
    enum: ["hr", "admin", "system"],
    default: "admin",
  },
  creatorId: { type: Schema.Types.ObjectId, ref: "User" },

  optionsEnum: {
    type: String,
    enum: ["Happy", "Stressed", "Normal", "yes", "no"],
    default: "Normal",
  },

  expiresAt: { type: Date },
});

feedPollSchema.pre("save", function (next) {
  if (this.creatorType === "system" && !this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
  next();
});
feedPollSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const feedPollModel = baseFeedPollModel.discriminator("poll", feedPollSchema);

export default feedPollModel;
