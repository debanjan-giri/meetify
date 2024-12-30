import { Schema, model } from "mongoose";

const likeSchema = new Schema({
  contentId: { type: Schema.Types.ObjectId, ref: "Media" },
  totalLikes: { type: Number, default: 0 },
  likes: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "baseUserModel",
        unique: true,
      },
      likeType: {
        type: String,
        enum: Object.values(likeTypeConst),
        default: likeTypeConst.LIKE,
      },
    },
  ],
});

const likeModel = model("likeModel", likeSchema);

export default likeModel;
