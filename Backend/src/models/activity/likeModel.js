import { Schema, model } from "mongoose";

const likeSchema = new Schema({
  contentId: { type: Schema.Types.ObjectId, ref: "contentModel" },
  totalLikes: { type: Number, default: 0 },
  likes: [
    {
      userName: { type: String, required: true, trim: true },
      userPhoto: { type: String, trim: true },
      likeType: {
        type: String,
        enum: Object.values(likeTypeConst),
      },
    },
  ],
});

const likeModel = model("likeModel", likeSchema);

export default likeModel;
