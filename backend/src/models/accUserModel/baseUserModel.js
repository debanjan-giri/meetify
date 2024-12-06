import { Schema, model } from "mongoose";

const baseUserSchema = new Schema(
  {
    userType: {
      type: String,
      enum: ["employee", "hr", "admin"],
      required: true,
      default: "employee",
    },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: { type: String, required: true, trim: true },
    profilePhoto: { type: String },
    dateOfBirth: { type: String },
    company: {
      type: String,
      required: true,
      enum: ["clirnet", "doctube", "mymd"],
      default: "clirnet",
    },
    designation: { type: String },
    bio: { type: String },
    myHashTagIds: [{ type: Schema.Types.ObjectId, ref: "hashTagListModel" }],
    myContendIds: [{ type: Schema.Types.ObjectId, ref: "baseContentModel" }],
    myConnectionIds: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
    myFdRequestIds: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
    moodsHistoryArray: [
      {
        date: { type: Date },
        mood: { type: String },
      },
    ],
    userAccess: { type: Boolean, default: true, required: true },
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
