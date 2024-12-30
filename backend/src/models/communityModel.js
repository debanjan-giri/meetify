import { Schema, model } from "mongoose";

const communitySchema = new Schema({
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: "baseUserModel",
    required: true,
  },

  communityType: {
    type: String,
    enum: ["developer", "office", "fun", "others"],
    required: true,
    default: "others",
  },

  communityName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    min: 3,
    max: 10,
  },
  trendingScore: { type: Number, default: 0 },
  contentArray: [
    {
      contentId: { type: Schema.Types.ObjectId, ref: "baseContentModel" },
    },
  ],
});
const communityModel = model("communityModel", communitySchema);
export default communityModel;
