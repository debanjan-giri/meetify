import { pollTypeConst } from "../typeConstant";
import basePollModel from "./basePollModel";

export const quizSchema = new Schema({
  questionsArray: [
    {
      question: { type: String, required: true, trim: true },
      ansArray: [
        {
          ans: { type: String, required: true, trim: true },
          isCorrect: { type: Boolean, default: false },
        },
      ],
    },
  ],
  resultArray: [
    {
      userName: { type: String, required: true, trim: true },
      score: { type: Number, default: 0 },
    },
  ],
});

export const quizModel = basePollModel.discriminator(
  pollTypeConst.QUIZ,
  quizSchema
);
