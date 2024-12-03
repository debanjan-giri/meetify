import { Schema, model } from "mongoose";
import baseContentModel from "./baseContentModel";

const statusSchema = new Schema({
  expiredAt: { type: Date, default: Date.now + 30 * 24 * 60 * 60 * 1000 },
});
statusSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

const statusModel = baseContentModel.discriminator("status", statusSchema);

export default statusModel;
