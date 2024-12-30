import { Schema, model } from "mongoose";
import { actionConst } from "../constant/typeConstant";

const matchSchema = new Schema({
  userId1: {
    type: Schema.Types.ObjectId,
    ref: "baseUserModel",
    required: true,
  },
  userId2: {
    type: Schema.Types.ObjectId,
    ref: "baseUserModel",
    required: true,
  },
  actionType: {
    type: String,
    enum: Object.values(actionConst),
    default: actionConst.LIKE,
  },
  firstUserAction: { type: String, enum: Object.values(actionConst) },
  secondUserAction: { type: String, enum: Object.values(actionConst) },
  mutualAction: { type: String, enum: Object.values(actionConst) },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: 24 * 60 * 60 * 1000 },
});

matchSchema.index({ userId1: 1, userId2: 1 }, { unique: true });

const baseMatchModel = model("baseMatchModel", matchSchema);
export default baseMatchModel;
