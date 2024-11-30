import postSubmitModel from "../models/postSubmitModel.js";
import moodModel from "../models/moodModel.js";
import challengeModel from "../models/challengeModel.js";

export const getActivityFeed = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Pagination params
  const userId = req.user._id; // Assuming user is authenticated

  try {
    const skip = (page - 1) * limit;

    // Fetch data from multiple models concurrently
    const [posts, polls, challenges] = await Promise.all([
      postSubmitModel
        .find({ visibilityId: userId }) // Only posts visible to this user
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      moodModel
        .find({ expiresAt: { $gte: Date.now() } }) // Active polls only
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      challengeModel
        .find({}) // Challenges (you can filter further if needed)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    // Combine and sort by createdAt
    const combinedData = [
      ...posts.map(item => ({ ...item, type: "post" })),
      ...polls.map(item => ({ ...item, type: "poll" })),
      ...challenges.map(item => ({ ...item, type: "challenge" })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort descending

    // Paginate and return the response
    const paginatedData = combinedData.slice(0, limit);

    res.status(200).json({
      data: paginatedData,
      meta: {
        currentPage: page,
        totalItems: combinedData.length,
        hasMore: combinedData.length > limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch activity feed", error });
  }
};
