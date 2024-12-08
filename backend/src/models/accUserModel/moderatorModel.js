import { Schema } from "mongoose";
import baseUserModel from "./baseUserModel.js";

const moderatorSchema = new Schema({
  hrIds: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
  adminIds: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
  employeeIds: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
});

const moderatorModel = baseUserModel.discriminator(3, moderatorSchema);

export default moderatorModel;
