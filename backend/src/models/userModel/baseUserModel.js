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
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: { type: String, required: true, trim: true },
    photoUrl: { type: String },
    dateOfBirth: { type: String },
    company: { type: String },
    designation: { type: String },
    bio: { type: String },
    skills: [String],
    hashTagId: [{ type: Schema.Types.ObjectId, ref: "hashTagListModel" }],
    postsId: [{ type: Schema.Types.ObjectId, ref: "baseContentModel" }],
    connectionId: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
    requestId: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
    moodsHistory: [
      {
        date: { type: Date },
        mood: { type: String },
      },
    ],
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

function omitSensitiveFields(doc, ret) {
  delete ret.password;
  delete ret.__v;
  return ret;
}
