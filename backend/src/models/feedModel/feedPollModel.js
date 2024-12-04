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

    creatorType: {
      type: String,
      enum: ["hr", "admin", "system"],
      default: "admin",
    },
    creatorId: { type: Schema.Types.ObjectId, ref: "User" },

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
    optionsEnum: {
      type: String,
      enum: ["Happy", "Stressed", "Normal", "yes", "no"],
      default: "Normal",
    },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
  },
  { discriminatorKey: "contentType", timestamps: true }
);

baseFeedPollModel.pre("save", function (next) {
  if (this.creatorType === "system" && !this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
  next();
});

baseFeedPollModel.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const baseFeedPollModel = model("baseFeedPollModel", baseFeedPollSchema);
export default baseFeedPollModel;
