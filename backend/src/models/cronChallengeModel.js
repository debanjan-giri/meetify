import { Schema, model } from "mongoose";

const cronChallengeSchema = new Schema({
  // content
  title: { type: String, required: true, default: "lunch with challenge " },
  description: { type: String },
  photoUrl: { type: String },

  // user
  participantsId: [{ type: Schema.Types.ObjectId, ref: "User" }],
  submitDataId: [{ type: Schema.Types.ObjectId, ref: "User" }],

  // date
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: Date.now + 24 * 60 * 60 * 1000 },
});

cronChallengeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export default model("cronChallengeModel", cronChallengeSchema);
