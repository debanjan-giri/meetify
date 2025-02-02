import { Schema, model } from "mongoose";
import { GENDER_TYPE, USER_TYPE } from "../../constant/databaseConstant.js";

const userSchema = new Schema(
  {
    userAccess: {
      type: Boolean,
      default: true,
      required: true,
    },
    userType: {
      type: Number,
      enum: [USER_TYPE.ADMIN, USER_TYPE.EMPLOYEE, USER_TYPE.HR],
      required: true,
      default: USER_TYPE.EMPLOYEE,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    photoUrl: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: [
        GENDER_TYPE.FEMALE,
        GENDER_TYPE.MALE,
        GENDER_TYPE.OTHER,
        GENDER_TYPE.NONE,
      ],
      default: GENDER_TYPE.NONE,
    },
    company: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      enum: ["clirnet", "doctube", "mymd"],
    },
    designation: {
      type: String,
      trim: true,
      lowercase: true,
    },
    bio: {
      type: String,
      trim: true,
      lowercase: true,
    },
    hrIds: [{ type: Schema.Types.ObjectId, ref: "userModel", default: [] }],
    employeeIds: [
      { type: Schema.Types.ObjectId, ref: "userModel", default: [] },
    ],
    communityAccId: [{ type: Schema.Types.ObjectId, ref: "communityModel" }],
    contentId: [{ type: Schema.Types.ObjectId, ref: "contentModel" }],
    connectedId: [{ type: Schema.Types.ObjectId, ref: "userModel" }],
    requestId: [{ type: Schema.Types.ObjectId, ref: "userModel" }],
    profileViews: [{ type: Schema.Types.ObjectId, ref: "userModel" }],
  },
  {
    timestamps: true,
  }
);

const userModel = model("userModel", userSchema);
userModel.createIndexes({ email: 1 });
export default userModel;
