import { Schema } from "mongoose";
import baseUserModel from "./base_User_Model.js";

const hrSchema = new Schema({
  dateOfBirth: { type: String },
  company: { type: String, required: true },
  designation: { type: String },
  bio: { type: String },
  skills: [String],
  hrId: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
  employeeId: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
  reportedDetails: [
    { 
      dataId: { type: Schema.Types.ObjectId, ref: "baseSubmitModel" },
      authorId: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
      reportedById: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
    },
  ],
});

const hrModel = baseUserModel.discriminator("hr", hrSchema);

export default hrModel;
