import { Schema } from "mongoose";
import baseUserModel from "./baseUserModel.js";

const employeeSchema = new Schema({
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
