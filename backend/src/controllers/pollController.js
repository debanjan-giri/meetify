import { contentTypeConst, pollTypeConst } from "../models/typeConstant";
import basePollModel from "../models/unifyPoll/basePollModel";
import { isValidId } from "../utils/utilityFunction";
import { isContentTypeConst } from "../validation/typeCheckSchema";
import { isId, isString } from "../validation/validationSchema";

export const createPollController = async (req, res, next) => {
  try {
    const userId = req?.Token?.id;

    const { contentType, question, ansArray } =
      inputValidation(
        req.body,
        next,
        Joi.object({
          question: isString.required(),
          ansArray: Joi.array()
            .items(
              Joi.object({
                ans: isString.required(),
              })
            )
            .min(2)
            .max(3)
            .required(),
          contentType: isContentTypeConst.required(),
        })
      );

    if (contentType === contentTypeConst.STATUS) {
      return errResponse(res, "Status Poll is not allowed", 400);
    }

    // Prepare the poll data
    const pollData = {
      pollType: pollTypeConst.POLL,
      question,
      ansArray: ansArray.map((answer) => ({
        ans: answer.ans,
        count: 0,
      })),
      contentType,
      creatorId: userId,
    };

    // store poll
    const poll = await basePollModel.create(pollData);

    if (!poll) {
      return errResponse(res, "Poll not created", 400);
    }

    return okResponse(res, "Poll created successfully");
  } catch (error) {
    console.error(`Error in createPollController: ${error.message}`);
    return next(error);
  }
};

export const getMyPollsController = async (req, res, next) => {
  try {
    const userId = req?.Token?.id;

    // Validate query parameters
    const { cursor, limit = 10 } = inputValidation(
      req.query,
      next,
      Joi.object({
        cursor: Joi.date().optional(),
        limit: Joi.number().min(1).max(50).optional(),
      })
    );

    const pageSize = Math.min(parseInt(limit, 10), 50); // Enforce max limit
    const query = { creatorId: userId };

    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    // Fetch polls with cursor pagination
    const polls = await basePollModel
      .find(query)
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(pageSize)
      .lean();

    // Determine next cursor
    const nextCursor = polls.length ? polls[polls.length - 1].createdAt : null;

    return okResponse(res, "Polls fetched successfully", {
      polls,
      nextCursor,
      hasNextPage: !!nextCursor,
    });
  } catch (error) {
    console.error(`Error in getMyPollsController: ${error.message}`);
    return next(error);
  }
};

export const deletePollByIdController = async (req, res, next) => {
  try {
    const userId = req?.Token?.id;

    // Validate request parameters
    const { pollId } = inputValidation(
      req.params,
      next,
      Joi.object({
        pollId: Joi.string().required(),
      })
    );

    const isPollIdValid = isValidId(next, pollId); // Ensure poll ID is Valid

    // Find the poll using poll ID and creator ID
    const poll = await basePollModel.findOneAndDelete({
      _id: isPollIdValid,
      creatorId: userId,
    });

    if (!poll) {
      return errResponse(res, "Poll not found or unauthorized action", 404);
    }

    return okResponse(res, "Poll deleted successfully");
  } catch (error) {
    console.error(`Error in deletePollByIdController: ${error.message}`);
    return next(error);
  }
};

export const submitPollByIdController = async (req, res, next) => {
  try {
    const userProfile = req?.Token?.profilePhoto;

    // Extract the user-provided answer index and poll ID
    const { answerIndex, pollId } = inputValidation(
      req.body,
      next,
      Joi.object({
        answerIndex: Joi.number().min(0).required(),
        pollId: isId.required(), // Validate poll ID
      })
    );

    // Ensure poll ID is valid
    const isPollIdValid = isValidId(next, pollId);

    // Fetch the poll document from the database
    const poll = await basePollModel.findById(isPollIdValid);

    if (!poll) {
      return errResponse(res, "Poll not found", 404);
    }

    // Check if the answer index is within valid bounds
    if (answerIndex >= poll.ansArray.length) {
      return errResponse(res, "Invalid answer index", 400);
    }

    // Increment the vote count for the selected answer
    poll.ansArray[answerIndex].count += 1;

    // Add the user profile photo to the answer's userPhotos array (if not already added)
    if (!poll.ansArray[answerIndex].userPhotos) {
      poll.ansArray[answerIndex].userPhotos = [];
    }
    if (!poll.ansArray[answerIndex].userPhotos.includes(userProfile)) {
      poll.ansArray[answerIndex].userPhotos.push(userProfile);
    }

    // Save the updated poll document
    await poll.save();

    // Prepare the response data with click counts for each answer index
    const clickCounts = poll.ansArray.map((ans, index) => ({
      index,
      count: ans.count,
    }));

    return okResponse(res, "Answer submitted successfully", clickCounts);
  } catch (error) {
    console.error(`Error in submitPollByIdController: ${error.message}`);
    return next(error);
  }
};

export const systemGetOnePollController = async (req, res, next) => {
  try {
    const poll = await basePollModel
      .findOne({ contentType: contentTypeConst.SYSTEM })
      .select("question ansArray")
      .lean();

    if (!poll) {
      return errResponse(res, "Poll not found", 404);
    }

    return okResponse(res, "Poll fetched successfully", poll);
  } catch (error) {
    console.error(`Error in systemGetOnePollController: ${error.message}`);
    return next(error);
  }
};
