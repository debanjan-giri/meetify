import { Schema, model } from "mongoose";

const userAuthSchema = new Schema({
  // user type
  userType: {
    type: String,
    enum: ["employee", "hr", "admin"],
    default: "employee",
  },

  // user details
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  company: { type: String, required: true },
  designation: { type: String, required: true },
  bio: { type: String },
  skills: [String],
  profilePicture: { type: String },
  dateOfBirth: { type: String },

  // connections
  groupsId: [{ type: Schema.Types.ObjectId, ref: "Group" }],
  employeesId: [{ type: Schema.Types.ObjectId, ref: "Group" }],
  postsId: [{ type: Schema.Types.ObjectId, ref: "Group" }],

  // modarations
  reportedDetails: [
    {
      dataId: { type: Schema.Types.ObjectId, ref: "post" },
      autherId: { type: Schema.Types.ObjectId, ref: "User" },
      reportedById: { type: Schema.Types.ObjectId, ref: "User" },
    },
  ],
});

export default model("userAuthModel", userAuthSchema);
