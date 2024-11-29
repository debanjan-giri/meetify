import { Schema, model } from "mongoose";

const postSchema = new Schema({
  content: { type: String, required: true },  // The content of the post
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true }, // The creator of the post
  group: { type: Schema.Types.ObjectId, ref: "Group", required: true }, // The group the post belongs to
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },  // Timestamp for when the post is updated
});

export default model("Post", postSchema);
