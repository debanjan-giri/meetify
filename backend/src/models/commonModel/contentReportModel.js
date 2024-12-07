import { Schema, model } from "mongoose";

const contentReportSchema = new Schema({
  reportedContentArray: [
    {
      contentId: { type: Schema.Types.ObjectId, ref: "baseContentModel" },
      creatorId: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
      reportedById: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
    },
  ],
});

export default model("contentReportModel", contentReportSchema);
