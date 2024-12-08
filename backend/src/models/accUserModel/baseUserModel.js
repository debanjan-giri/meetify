import { Schema, model } from "mongoose";
import { userTypeConst } from "../typeConstant.js";

const baseUserSchema = new Schema(
  {
    // User Type
    userType: {
      type: Number,
      enum: Object.values(userTypeConst),
      required: true,
      default: userTypeConst.EMPLOYEE,
      index: true, // Indexed for faster filtering
    },

    // Personal Information
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
      unique: true, // Ensures no duplicate emails
      index: true, // Fast lookup
    },
    password: { type: String, required: true, select: false }, // Excluded from query results

    profilePhoto: { type: String, trim: true },
    dateOfBirth: { type: String, trim: true },

    // Employment Information
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

    // Relationships
    myHashTagIds: [{ type: Schema.Types.ObjectId, ref: "hashTagListModel" }],
    myContendIds: [{ type: Schema.Types.ObjectId, ref: "baseContentModel" }],
    myConnectionIds: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],
    myFdRequestIds: [{ type: Schema.Types.ObjectId, ref: "baseUserModel" }],

    // Moods History
    moodsHistoryArray: [
      {
        date: { type: Date },
        mood: { type: String, trim: true },
      },
    ],

    // Access Control
    userAccess: {
      type: Boolean,
      default: false,
      required: true,
      select: false,
    },
  },
  {
    discriminatorKey: "userType", // Enables schema inheritance
    timestamps: true, // Adds createdAt and updatedAt fields
    toJSON: { transform: omitSensitiveFields },
    toObject: { transform: omitSensitiveFields },
  }
);

const baseUserModel = model("baseUserModel", baseUserSchema);
export default baseUserModel;

// Helper to remove sensitive fields from responses
function omitSensitiveFields(doc, ret) {
  delete ret.password;
  delete ret.__v;
  delete ret.userAccess;
  delete ret._id;
  delete ret.createdAt;
  delete ret.updatedAt;
  return ret;
}
