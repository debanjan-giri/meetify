import moodModel from "../models/moodModel.js";

export const getActivePoll = async (req, res) => {
  try {
    // Fetch the most recent active poll
    const activePoll = await moodModel
      .findOne({
        expiresAt: { $gte: Date.now() },
      })
      .sort({ createdAt: -1 });

    if (!activePoll) {
      return res.status(404).json({ message: "No active poll found" });
    }

    // Return the poll without percentages
    res.status(200).json({
      poll: {
        _id: activePoll._id,
        title: activePoll.title,
        types: activePoll.types,
        options: activePoll.options.map((option) => ({ text: option.text })), // Only show option text
        expiresAt: activePoll.expiresAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the poll", error });
  }
};

export const submitVote = async (req, res) => {
  const { pollId, selectedOption } = req.body;

  if (!pollId || !selectedOption) {
    return res
      .status(400)
      .json({ message: "Poll ID and selected option are required" });
  }

  try {
    // Find the poll by ID and ensure it's still active
    const poll = await moodModel.findOne({
      _id: pollId,
      expiresAt: { $gte: Date.now() },
    });

    if (!poll) {
      return res.status(404).json({ message: "Poll not found or has expired" });
    }

    // Update the count for the selected option
    const optionIndex = poll.options.findIndex(
      (option) => option.text === selectedOption
    );
    if (optionIndex === -1) {
      return res.status(400).json({ message: "Invalid option selected" });
    }

    poll.options[optionIndex].count += 1; // Increment the count for the selected option
    await poll.save(); // Save the updated poll

    // Calculate the updated percentages for each option
    const totalVotes = poll.options.reduce(
      (sum, option) => sum + option.count,
      0
    );
    const optionsWithPercentage = poll.options.map((option) => ({
      text: option.text,
      count: option.count,
      percentage:
        totalVotes > 0
          ? ((option.count / totalVotes) * 100).toFixed(2)
          : "0.00",
    }));

    res.status(200).json({
      message: "Vote submitted successfully",
      poll: {
        _id: poll._id,
        title: poll.title,
        types: poll.types,
        options: optionsWithPercentage, // Include percentages after voting
        expiresAt: poll.expiresAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit the vote", error });
  }
};
