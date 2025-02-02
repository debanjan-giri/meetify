import { Schema, model } from "mongoose";

const reportSchema = new Schema({
  contentId: {
    type: Schema.Types.ObjectId,
    ref: "contentModel",
    required: true,
  },
  reportedDetails: {
    reportedByName: { type: String, trim: true, lowercase: true },
    reportedByPhoto: { type: String, trim: true },
    reportedByEmail: { type: String, trim: true, lowercase: true },
  },
});

const reportModel = model("reportModel", reportSchema);

export default reportModel;
