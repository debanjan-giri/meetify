import { Schema, model } from "mongoose";

const praiseSchema = new Schema({
  praiseArray: [
    {
      question: { type: String, required: true, trim: true },
      voting: [
        {
          userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true,
            unique: true,
          },
          totalCount: { type: Number, default: 0 },
        },
      ],
    },
  ],
  expireAt: { type: Date, default: 24 * 60 * 60 * 1000 },
});

praiseSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const praiseModel = model("praiseModel", praiseSchema);
export default praiseModel;
