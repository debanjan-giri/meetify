import { Schema, model } from "mongoose";
import { userTypeConst } from "../typeConstant.js";

const baseUserSchema = new Schema(
  {
    userType: {
      type: Number,
      enum: Object.values(userTypeConst),
      required: true,
      default: userTypeConst.employee,
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
    password: { type: String, required: true, trim: true, select: false },
    profilePhoto: {
      type: String,
      trim: true,
    },
    dateOfBirth: { type: String, trim: true },
    company: {
      type: String,
      required: true,
      trim: true,
      enum: ["clirnet", "doctube", "mymd"],
      default: "clirnet",
    },
    designation: { type: String, trim: true },
    bio: { type: String, trim: true },
    myHashTagIds: [{ type: Schema.Types.ObjectId, ref: "hashTagListModel" }],
    myContendIds: [{ type: Schema.Types.ObjectId, ref: "baseContentModel" }],
    myConnectionIds: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
    myFdRequestIds: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
    moodsHistoryArray: [
      {
        date: { type: Date },
        mood: { type: String, trim: true },
      },
    ],
    userAccess: { type: Boolean, default: true, required: true, select: false },
  },
  {
    discriminatorKey: "userType",
    timestamps: true,
    toJSON: { transform: omitSensitiveFields },
    toObject: { transform: omitSensitiveFields },
  }
);

const baseUserModel = model("baseUserModel", baseUserSchema);
export default baseUserModel;

// skip in response
function omitSensitiveFields(doc, ret) {
  delete ret.password;
  delete ret.__v;
  delete ret.userAccess;
  return ret;
}
