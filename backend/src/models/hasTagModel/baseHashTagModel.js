import { Schema, model } from "mongoose";

const baseHashTagSchema = new Schema(
  {
    contentType: {
      type: String,
      enum: ["post", "poll"],
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "baseUserModel", required: true },
    hashtagId: { type: Schema.Types.ObjectId, ref: "hashTagListModel" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    discriminatorKey: "contentType",
    timestamps: true,
  }
);

const baseHashTagModel = model("baseHashTagModel", baseHashTagSchema);

export default baseHashTagModel;
