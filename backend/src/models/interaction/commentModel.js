const commentSchema = new Schema({
  contentId: { type: Schema.Types.ObjectId, ref: "Media" },
  totalComments: { type: Number, default: 0 },
  comments: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
      comment: { type: String, trim: true, min: 1, max: 50 },
      totalLike: { type: Number, default: 0 },
      createdAt: { type: Date, default: Date.now, index: true },
      nestedComments: [
        {
          userId: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
          comment: { type: String, trim: true, min: 1, max: 30 },
        },
      ],
    },
  ],
});

const commentModel = model("commentModel", commentSchema);

export default commentModel;
