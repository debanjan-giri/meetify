import { Schema, model } from "mongoose";

const baseUserSchema = new Schema(
  {
    userType: {
      type: String,
      enum: ["employee", "hr", "admin"],
      required: true,
      default: "employee",
    },
    userAccess: { type: Boolean, default: true, required: true },
    name: { type: String },
    email: { type: String, required: true, trim: true, lowercase: true },
    password: { type: String, required: true, trim: true },
    photoUrl: { type: String },
    dateOfBirth: { type: String },
    company: { type: String },
    designation: { type: String },
    bio: { type: String },
    skills: [String],
    hashTagId: [{ type: Schema.Types.ObjectId, ref: "hashTagListModel" }],
    postsId: [{ type: Schema.Types.ObjectId, ref: "baseSubmitModel" }],
  },
  { discriminatorKey: "userType", timestamps: true }
);

const baseUserModel = model("baseUserModel", baseUserSchema);
export default baseUserModel;
