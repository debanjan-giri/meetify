import { Schema, model } from "mongoose";

const moodPollSchema = new Schema({
  question: { type: String, default: "How are you feeling today?" }, // Default mood question
  options: [
    {
      text: { type: String, required: true }, // Option text (e.g., "Happy", "Stressed")
      count: { type: Number, default: 0 }, // Count of votes for the option
    },
  ],
  createdAt: { type: Date, default: Date.now }, // Poll creation timestamp
  expiresAt: { type: Date, required: true }, // Expiration date for the poll
  anonymous: { type: Boolean, default: true }, // Whether responses are anonymous
});

export default model("MoodPoll", moodPollSchema);
