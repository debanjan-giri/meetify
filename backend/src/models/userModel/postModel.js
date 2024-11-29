import { Schema, model } from "mongoose";

const activityFeedModel = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String }, // Text content
  photo: { type: String }, // URL to photo if attached
  selectedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }], // For "selected" visibility
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of users who liked
  comments: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User" },
      content: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default model("activityFeed", activityFeedModel);
