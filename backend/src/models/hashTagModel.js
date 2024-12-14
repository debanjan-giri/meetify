import { Schema, model } from "mongoose";

const hashTagSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "baseUserModel",
    required: true,
  },
  hashTagName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
    validate: [
      {
        validator: function (value) {
          return value.startsWith("#");
        },
        message: "HashTag name must start with a '#' symbol.",
      },
      {
        validator: function (value) {
          return value.length > 1;
        },
        message: "invalid hashTag name",
      },
    ],
  },

  trendingScore: { type: Number, default: 0 },
  contentArray: [
    {
      creatorId: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
      contentId: { type: Schema.Types.ObjectId, ref: "baseContentModel" },
    },
  ],
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
const hashTagModel = model("hashTagModel", hashTagSchema);
export default hashTagModel;
