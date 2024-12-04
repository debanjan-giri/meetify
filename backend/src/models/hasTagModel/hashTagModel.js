import { Schema, model } from "mongoose";

const hashTagSchema = new Schema({
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: "baseUserModel",
    required: true,
  },
  hashTagName: { type: String, required: true, unique: true },
  trendingScore: { type: Number, default: 0 },

  submitedById: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
      dataId: { type: Schema.Types.ObjectId, ref: "baseContentModel" },
    },
  ],
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const hashTagModel = model("hashTagModel", hashTagSchema);

export default hashTagModel;
