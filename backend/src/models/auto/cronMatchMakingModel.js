import { Schema, model } from "mongoose";

const cronMatchMakingSchema = new Schema({
    userId1: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userId2: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isMatched: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ["pending", "revealed", "rejected"],
        default: "pending",
    },
    question: { type: String, required: true },
    questionId: { type: String, required: true },
    options: [
        {
            text: { type: String, required: true },
            reaction: { type: String, required: true },
        },
    ],
    optionsEnum: {
        type: String,
        enum: ["Work Pressure", "Agree", "Next Time", "Yes", "No", "Maybe"],
        default: "Yes",
    },

    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: Date.now + 7 * 60 * 60 * 1000 },
})

cronMatchMakingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export default model("cronMatchMakingModel", cronMatchMakingSchema);

