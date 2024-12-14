import { Schema } from "mongoose";
import baseUserModel from "./baseUserModel.js";
import { userTypeConst } from "../typeConstant.js";

const moderatorSchema = new Schema({
  hrIds: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
  adminIds: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
  employeeIds: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
});

// Create a discriminator for ADMIN
const adminModel = baseUserModel.discriminator(
  userTypeConst.ADMIN,
  moderatorSchema
);

// Create a discriminator for HR
const hrModel = baseUserModel.discriminator(userTypeConst.HR, moderatorSchema);

export { adminModel, hrModel };
