import { Schema, model } from "mongoose";

const baseHashTagSchema = new Schema({
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: "baseUserModel",
    required: true,
  },
  hashTagName: { type: String, required: true, unique: true },
  trendingScore: { type: Number, default: 0 },

  contentSubmitedArray: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
      contentId: { type: Schema.Types.ObjectId, ref: "baseContentModel" },
    },
  ],
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const baseHashTagModel = model("baseHashTagModel", baseHashTagSchema);

export default baseHashTagModel;
