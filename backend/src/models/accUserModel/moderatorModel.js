import { Schema } from "mongoose";
import baseUserModel from "./baseUserModel.js";

const modaratorSchema = new Schema({
  hrIds: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
  adminIds: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
  employeeIds: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
  reportedDetailsArray: [
    {
      contentId: { type: Schema.Types.ObjectId, ref: "baseContentModel" },
      submitedId: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
      reportedId: { type: Schema.Types.ObjectId, ref: "baseUserModel" },
    },
  ],
});

const modaratorModel = baseUserModel.discriminator("admin", modaratorSchema);

export default modaratorModel;
