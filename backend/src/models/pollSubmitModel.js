import { Schema, model } from "mongoose";

const pollSchema = new Schema({
  // user
  creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  creatorType: {
    type: String,
    enum: ["hr", "system", "admin"],
    default: "system",
  },

  // type of content
  contentType: [
    {
      type: String,
      enum: ["poll", "qote"],
      required: true,
    },
  ],

  // content
  question: { type: String },
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

  // submission id
  submitedById: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      reactionType: { type: String },
    },
  ],

  // modaration
  visibilityId: [{ type: Schema.Types.ObjectId, ref: "User" }],
  reported: {
    type: Boolean,
    default: false,
  },

  // date
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: Date.now + 24 * 60 * 60 * 1000 },
});

pollSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model("pollModel", pollSchema);
