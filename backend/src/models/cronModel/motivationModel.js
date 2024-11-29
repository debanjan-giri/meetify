import { Schema, model } from "mongoose";

const quoteSchema = new Schema({
  text: { type: String, required: true }, // The quote text
  author: { type: String }, // Author of the quote (optional)
  category: {
    type: String,
    enum: ["motivational", "inspirational", "funny"],
    default: "motivational",
  },
  createdAt: { type: Date, default: Date.now },
});

export default model("Quote", quoteSchema);
