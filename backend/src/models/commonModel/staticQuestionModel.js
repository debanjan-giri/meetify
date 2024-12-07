import { Schema, model } from "mongoose";

const questionSchema = new Schema({
  question: [{ type: String, required: true }],

  creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },

  userType: {
    type: String,
    enum: ["hr", "admin"],
    default: "admin",
  },

  contentType: {
    type: String,
    enum: ["poll", "challenge", "quote"],
    default: "poll",
  },
  createdAt: { type: Date, default: Date.now },
});

export default model("questionModel", questionSchema);
