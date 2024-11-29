import { Schema, model } from "mongoose";

const storySchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String },
  photo: { type: String }, // URL to story photo
  selectedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  expiresAt: { type: Date, default: () => Date.now() + 24 * 60 * 60 * 1000 }, // Expires in 24 hours
  createdAt: { type: Date, default: Date.now },
});

export default model("Story", storySchema);
