import { Schema, model } from "mongoose";
const commentSchema = new Schema({
  contentId: {
    type: Schema.Types.ObjectId,
    ref: "contentModel",
    required: true,
  },
  totalComments: { type: Number, default: 0 },
  comments: [
    {
      userPhoto: { type: String, trim: true },
      comment: { type: String, trim: true, min: 1, max: 50 },
      totalLike: { type: Number, default: 0 },
      createdAt: { type: Date, default: Date.now, index: true },
      nestedComments: [
        {
          userName: { type: String, required: true, trim: true },
          userPhoto: { type: String, trim: true },
          comment: { type: String, trim: true, min: 1, max: 30 },
        },
      ],
    },
  ],
});

const commentModel = model("commentModel", commentSchema);

export default commentModel;
