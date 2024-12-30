import { Schema, model } from "mongoose";

const viewSchema = new Schema({
  contentId: {
    type: Schema.Types.ObjectId,
    ref: "baseContentModel",
    required: true,
  },
  totalViews: { type: Number, default: 0 },
  views: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "baseUserModel",
        unique: true,
      },
      viewedAt: { type: Date, default: Date.now },
    },
  ],
});

const viewModel = model("viewModel", viewSchema);

export default viewModel;
