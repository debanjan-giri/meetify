import { Schema, model } from "mongoose";

const hashtagListSchema = new Schema({
  tag: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  hashTagSubmitId: [{ type: Schema.Types.ObjectId, ref: "baseSubmitModel" }],
  createdAt: { type: Date, default: Date.now },
  trendingScore: { type: Number, default: 0 },
  userId: { type: Schema.Types.ObjectId, ref: "baseUserModel", required: true },
  reported: {
    type: Boolean,
    default: false,
  },
});

const hashTagListModel = model("hashTagListModel", hashtagListSchema);
export default hashTagListModel;
