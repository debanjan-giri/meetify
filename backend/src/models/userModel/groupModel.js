import { Schema, model } from "mongoose";

const groupSchema = new Schema({
  groupName: { type: String, required: true },
  description: { type: String },
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }], // List of members in the group
  invitations: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User" }, // The user who was invited
      status: {
        type: String,
        enum: ["pending", "accepted", "declined"],
        default: "pending",
      },
    },
  ], // Store invitations with status for pending/accepted/declined
  visibility: { type: String, enum: ["public", "private"], default: "public" },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }], // Store the posts in the group
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }, // Timestamp for when the group is updated
});

export default model("Group", groupSchema);
