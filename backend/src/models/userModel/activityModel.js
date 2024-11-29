import { Schema, model } from "mongoose";

// Reference to different models based on contentType
const activityFeedSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // The user who triggered the activity
  contentType: {
    type: String,
    enum: [
      "post",
      "virtualChallenge",
      "motivationalQuote",
      "matchmaking",
      "poll",
      "systemGenerated",
    ],
    required: true,
  },
  content: {
    type: Schema.Types.Mixed, // This can vary based on content type (e.g., text, image, challenge details, etc.)
    required: true,
  },
  targetModel: { type: String }, // Reference to the model that is generating content (e.g., "Post", "VirtualChallenge")
  targetId: { type: Schema.Types.ObjectId }, // Reference to the actual content (e.g., post ID, challenge ID)
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  visibility: { type: String, enum: ["public", "private"], default: "public" }, // Who can see it?
  status: { type: String, enum: ["active", "archived"], default: "active" }, // To mark feed items as archived
});

export default model("ActivityFeed", activityFeedSchema);
