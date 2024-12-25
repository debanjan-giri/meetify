import { Schema, model } from "mongoose";

const hashTagSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "baseUserModel",
    required: true,
  },

  photoUrl: { type: String, trim: true },

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
