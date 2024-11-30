import Post from "../models/Post.js";
import VirtualChallenge from "../models/VirtualChallenge.js";
import MotivationQuote from "../models/MotivationQuote.js";
import Matchmaking from "../models/Matchmaking.js";
import Poll from "../models/Poll.js";

export const getUserFeed = async (req, res, next) => {
  try {
    const userId = req.user.id; // Get the logged-in user's ID

    // Fetch data from different models
    const posts = await Post.find({ visibility: "public" }).lean(); // User-generated posts
    const challenges = await VirtualChallenge.find({ status: "active" }).lean(); // Active challenges
    const quotes = await MotivationQuote.find({})
      .sort({ createdAt: -1 })
      .limit(1)
      .lean(); // Latest motivational quote
    const matches = await Matchmaking.find({ participants: userId }).lean(); // Matchmaking results
    const polls = await Poll.find({ status: "active" }).lean(); // Active polls

    // Combine data with a common structure
    const combinedFeed = [
      ...posts.map((post) => ({ type: "post", data: post })),
      ...challenges.map((challenge) => ({
        type: "virtualChallenge",
        data: challenge,
      })),
      ...quotes.map((quote) => ({ type: "motivationQuote", data: quote })),
      ...matches.map((match) => ({ type: "matchmaking", data: match })),
      ...polls.map((poll) => ({ type: "poll", data: poll })),
    ];

    // Sort the feed by timestamp (e.g., createdAt)
    combinedFeed.sort(
      (a, b) => new Date(b.data.createdAt) - new Date(a.data.createdAt)
    );

    // Paginate (optional)
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Items per page
    const startIndex = (page - 1) * limit;
    const paginatedFeed = combinedFeed.slice(startIndex, startIndex + limit);

    // Send the response
    res.status(200).json({
      success: true,
      feed: paginatedFeed,
      totalItems: combinedFeed.length,
      currentPage: page,
      totalPages: Math.ceil(combinedFeed.length / limit),
    });
  } catch (error) {
    next(error);
  }
};
