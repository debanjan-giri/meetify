import { model } from "mongoose";

const quizSchema = new Schema({
  totalQuestion: { type: Number, default: 0 },
  quiz: [
    {
      question: { type: String, required: true, trim: true, lowercase: true },
      option: [
        {
          ans: { type: String, required: true, trim: true, lowercase: true },
          isCorrect: { type: Boolean, default: false },
        },
      ],
    },
  ],

  setTime: { type: Number, default: 0 },
  result: [
    {
      userName: { type: String, required: true, trim: true },
      userPhoto: { type: String, trim: true },
      score: { type: Number, default: 0 },
    },
  ],
  expireAt: { type: Date, default: 24 * 60 * 60 * 1000 },
});

quizSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const quizModel = model("quizModel", quizSchema);
export default quizModel;
