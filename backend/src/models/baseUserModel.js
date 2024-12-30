import { Schema, model } from "mongoose";
import { userTypeConst } from "../../constant/typeConstant";

const baseUserSchema = new Schema(
  {
    userAccess: {
      type: Boolean,
      default: false,
      required: true,
      select: false,
    },
    userType: {
      type: Number,
      enum: Object.values(userTypeConst),
      required: true,
      default: userTypeConst.EMPLOYEE,
      index: true,
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
      index: true,
    },
    password: { type: String, required: true, select: false },
    photoUrl: { type: String, trim: true },
    dateOfBirth: { type: String, trim: true },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "NA",
    },
    company: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      enum: ["clirnet", "doctube", "mymd"],
      default: "clirnet",
    },
    designation: { type: String, trim: true },
    bio: { type: String, trim: true },
    communityId: [
      { type: Schema.Types.ObjectId, ref: "hashTagListModel", index: true },
    ],
    contentId: [
      { type: Schema.Types.ObjectId, ref: "baseContentModel", index: true },
    ],
    connectionId: [
      { type: Schema.Types.ObjectId, ref: "baseUserModel", index: true },
    ],
    requestId: [
      { type: Schema.Types.ObjectId, ref: "baseUserModel", index: true },
    ],
    totalViews: { type: Number, default: 0 },
    views: [
      {
        type: Schema.Types.ObjectId,
        ref: "baseUserModel",
        unique: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const baseUserModel = model("baseUserModel", baseUserSchema);
export default baseUserModel;
