import { Schema } from "mongoose";
import baseUserModel from "./baseUserModel.js";

const adminSchema = new Schema({
  hrId: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
  adminId: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
  employeeId: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
  reportedDetails: [
    {
      dataId: { type: Schema.Types.ObjectId, ref: "baseContentModel" },
      authorId: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
      reportedById: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
    },
  ],
});

const adminModel = baseUserModel.discriminator("admin", adminSchema);

export default adminModel;
