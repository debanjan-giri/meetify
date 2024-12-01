import { Schema } from "mongoose";
import baseUserModel from "./baseUserModel";

const adminSchema = new Schema({
  hrId: [{ type: Schema.Types.ObjectId, ref: "User" }],
  adminId: [{ type: Schema.Types.ObjectId, ref: "User" }],
  employeeId: [{ type: Schema.Types.ObjectId, ref: "User" }],
  reportedDetails: [
    {
      dataId: { type: Schema.Types.ObjectId, ref: "baseSubmitModel" },
      authorId: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
      reportedById: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
    },
  ],
});

const adminModel = baseUserModel.discriminator("admin", adminSchema);

export default adminModel;
