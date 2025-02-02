import { Schema, model } from "mongoose";

const communitySchema = new Schema({
  creatorId: { type: Schema.Types.ObjectId, ref: "userModel", required: true },

  communityName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    min: 3,
    max: 10,
  },

  description: {
    type: String,
    required: true,
    trim: true,
    min: 10,
    max: 50,
  },

  communityType: {
    type: String,
    enum: [
      communityTypeConst.TEAM,
      communityTypeConst.WORK,
      communityTypeConst.FUN,
      communityTypeConst.OTHER,
      communityTypeConst.COMPANY,
      communityTypeConst.KNOWLEDGE,
      communityTypeConst.PHOTOGRAPHY,
      communityTypeConst.EVENT,
      communityTypeConst.DEVELOPER,
    ],
    required: true,
  },

  trendingScore: { type: Number, default: 0 },
  views: [{ type: Schema.Types.ObjectId, ref: "viewsModel" }],
  contentId: [{ type: Schema.Types.ObjectId, ref: "contentModel" }],
});
const communityModel = model("communityModel", communitySchema);
export default communityModel;
