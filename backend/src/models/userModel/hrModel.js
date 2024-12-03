import { Schema } from "mongoose";
import baseUserModel from "./baseUserModel.js";

const hrSchema = new Schema({
  hrId: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
  employeeId: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
  reportedDetails: [
    {
      dataId: { type: Schema.Types.ObjectId, ref: "baseContentModel" },
      authorId: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
      reportedById: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
    },
  ],
});

const hrModel = baseUserModel.discriminator("hr", hrSchema);

export default hrModel;
