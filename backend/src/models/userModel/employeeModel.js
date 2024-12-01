import { Schema } from "mongoose";
import baseUserModel from "./baseUserModel";

const employeeSchema = new Schema({
  dateOfBirth: { type: String },
  company: { type: String, required: true },
  designation: { type: String },
  bio: { type: String },
  skills: [String],
  connectionId: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
  moodsHistory: [
    {
      date: { type: Date },
      mood: { type: String },
    },
  ],
});

const employeeModel = baseUserModel.discriminator("employee", employeeSchema);

export default employeeModel;
