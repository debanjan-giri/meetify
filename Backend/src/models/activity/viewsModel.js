import { Schema, model } from "mongoose";

const viewSchema = new Schema({
  contentId: {
    type: Schema.Types.ObjectId,
    ref: "contentModel",
    required: true,
  },
  totalViews: { type: Number, default: 0 },
  views: [
    {
      userName: { type: String, required: true, trim: true },
      userPhoto: { type: String, trim: true },
      viewedAt: { type: Date, default: Date.now },
    },
  ],
});

const viewModel = model("viewModel", viewSchema);

export default viewModel;
