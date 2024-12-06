import { Schema, model } from "mongoose";

const hashTagSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "baseUserModel",
    required: true,
  },
  hashTagName: { type: String, required: true, unique: true },
  trendingScore: { type: Number, default: 0 },
  mediaSubmittedArray: [
    {
      submittedById: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
      mediaId: { type: Schema.Types.ObjectId, ref: "baseContentModel" },
    },
  ],
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
const hashTagModel = model("hashTagModel", hashTagSchema);
export default hashTagModel;
