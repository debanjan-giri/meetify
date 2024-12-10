import baseContentModel from "../../models/feedContentModel/baseContentModel";
import hashTagPollModel from "../../models/hasTagModel/hashTagPollModel";
import hashTagPostModel from "../../models/hasTagModel/hashTagPostModel";
import { inputValidation, isValidId } from "../../utils/utilityFunction";
import {
  commentSubmitValidation,
  likeUnlikeSubmitValidation,
  typeValidation,
} from "../../validation/validationSchema";

export const getContentByIdController = async (req, res, next) => {
  try {
    const contentId = isValidId(req.body.contentId);
    const { type: contentType } = inputValidation(
      req.body,
      next,
      typeValidation
    );

    // Validate the type
    if (
      !contentType ||
      !["post", "status", "challenge", "tagPoll", "tagPost"].includes(
        contentType
      )
    ) {
      return errResponse(next, "Invalid type provided", 400);
    }

    // dynamic model
    const model = ["post", "status", "challenge"].includes(contentType)
      ? baseContentModel
      : contentType === "tagPoll"
      ? hashTagPollModel
      : hashTagPostModel;

    // check this user own this content in db
    const isOwnContent = await model.findOne({
      contendId: contentId,
    });
    if (!isOwnContent) return errResponse(next, "data protected", 404);

    // find content is exists
    const content = await model.findById(contentId);
    if (!content) return errResponse(next, "Content not found", 404);

    // return content
    return okResponse(res, "Content fetched successfully", content);
  } catch (error) {
    console.error(`Error in getContentByIdController: ${error.message}`);
    next(error);
  }
};

export const likeUnlikeSubmitController = async (req, res, next) => {
  try {
    const userId = req.token.id;
    const contentId = isValidId(req.body.contentId);
    const { type: contentType, likeType } = inputValidation(
      req.body,
      next,
      likeUnlikeSubmitValidation
    );

    // Validate the type
    if (
      !contentType ||
      !["post", "status", "challenge", "tagPoll", "tagPost"].includes(
        contentType
      )
    ) {
      return errResponse(next, "Invalid type provided", 400);
    }

    // valid like type
    if (!likeType || !["wow", "like", "funny", "happy"].includes(likeType)) {
      return errResponse(next, "Invalid like type provided", 400);
    }

    // dynamic model
    const model = ["post", "status", "challenge"].includes(contentType)
      ? baseContentModel
      : contentType === "tagPoll"
      ? hashTagPollModel
      : hashTagPostModel;

    const content = await model.findById(contentId);
    if (!content) {
      return errResponse(next, "Content not found", 404);
    }

    const existingLikeIndex = content.likedById.findIndex(
      (like) => like.userId.toString() === userId && like.likeType === likeType
    );

    let updateQuery = {};
    if (existingLikeIndex !== -1) {
      // User has already liked with this type -> Remove the like
      updateQuery = {
        $pull: {
          likedById: {
            userId,
            likeType,
          },
        },
        $inc: { likeCount: -1 },
      };
    } else {
      // User has not liked with this type -> Add the like
      updateQuery = {
        $addToSet: {
          likedById: {
            userId,
            likeType,
          },
        },
        $inc: { likeCount: 1 },
      };
    }

    // Update the content in the database
    const updatedContent = await model.findByIdAndUpdate(
      contentId,
      updateQuery,
      {
        new: true,
      }
    );

    if (!updatedContent) {
      return errResponse(next, "Failed to update content", 500);
    }

    // Return success response
    return okResponse(
      res,
      existingLikeIndex !== -1
        ? "Content unliked successfully"
        : "Content liked successfully",
      updatedContent
    );
  } catch (error) {
    console.log(`Error in likeSubmitController ${error}`);
    next(error);
  }
};

export const commentSubmitController = async (req, res, next) => {
  try {
    const userId = req.token.id;
    const contentId = isValidId(req.body.contentId);
    const { type: contentType, comment } = inputValidation(
      req.body,
      next,
      commentSubmitValidation
    );

    // Validate the type
    if (
      !contentType ||
      !["post", "status", "challenge", "tagPoll", "tagPost"].includes(
        contentType
      )
    ) {
      return errResponse(next, "Invalid type provided", 400);
    }

    // dynamic model
    const model = ["post", "status", "challenge"].includes(contentType)
      ? baseContentModel
      : contentType === "tagPoll"
      ? hashTagPollModel
      : hashTagPostModel;

    const updatedComment = await model.findByIdAndUpdate(
      contentId,
      {
        $push: {
          commentsById: {
            userId,
            comment,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );
    if (!updatedComment) {
      return errResponse(next, "Failed to update content", 500);
    }
    // return content
    return okResponse(res, "Comment added successfully", updatedComment);
  } catch (error) {
    console.log(`Error in commentSubmitController ${error}`);
    next(error);
  }
};

export const likeUnlikeCommentController = async (req, res, next) => {
  try {
    const userId = req.token.id;
    const contentId = isValidId(req.body.contentId);
    const commentId = isValidId(req.body.commentId);
    const { type: contentType } = inputValidation(
      req.body,
      next,
      typeValidation
    );

    // Validate content type
    if (
      !contentType ||
      !["post", "status", "challenge", "tagPoll", "tagPost"].includes(
        contentType
      )
    ) {
      return errResponse(next, "Invalid content type provided", 400);
    }

    // Select the appropriate model dynamically
    const model = ["post", "status", "challenge"].includes(contentType)
      ? baseContentModel
      : contentType === "tagPoll"
      ? hashTagPollModel
      : hashTagPostModel;

    // Check if the user has already liked the comment
    const content = await model.findOne({
      _id: contentId,
      "commentsById._id": commentId,
    });

    if (!content) {
      return errResponse(next, "Comment not found", 404);
    }

    const comment = content.commentsById.id(commentId);
    const hasLiked = comment.likedId.includes(userId);

    // Toggle like/unlike
    const update = hasLiked
      ? {
          $pull: { "commentsById.$.likedId": userId },
          $inc: { "commentsById.$.likeCount": -1 },
        }
      : {
          $addToSet: { "commentsById.$.likedId": userId },
          $inc: { "commentsById.$.likeCount": 1 },
        };

    const updatedContent = await model.findOneAndUpdate(
      {
        _id: contentId,
        "commentsById._id": commentId,
      },
      update,
      { new: true }
    );

    if (!updatedContent) {
      return errResponse(next, "Failed to update like status", 500);
    }

    return okResponse(
      res,
      hasLiked ? "Comment unliked successfully" : "Comment liked successfully",
      updatedContent
    );
  } catch (error) {
    console.error(`Error in likeUnlikeCommentController: ${error.message}`);
    next(error);
  }
};

export const getCommentController = async (req, res, next) => {
  try {
    const contentId = isValidId(req.params.contentId); // Assuming contentId is passed as a route parameter

    // Validate contentId
    if (!contentId) {
      return errResponse(next, "Invalid content ID provided", 400);
    }

    // Validate content type (optional, if needed)
    const { type: contentType } = inputValidation(
      req.body,
      next,
      commentSubmitValidation
    );
    if (
      !contentType ||
      !["post", "status", "challenge", "tagPoll", "tagPost"].includes(
        contentType
      )
    ) {
      return errResponse(next, "Invalid type provided", 400);
    }

    // Select the appropriate model based on content type
    const model = ["post", "status", "challenge"].includes(contentType)
      ? baseContentModel
      : contentType === "tagPoll"
      ? hashTagPollModel
      : hashTagPostModel;

    // Fetch content by contentId and populate comments
    const content = await model
      .findById(contentId)
      .select("commentsById") // Only return the comments array
      .populate("commentsById.userId", "username profilePic") // Populate user details for each comment (optional)
      .exec();

    // If no content is found with the provided contentId
    if (!content) {
      return errResponse(next, "Content not found", 404);
    }

    // Return the comments
    return okResponse(
      res,
      "Comments fetched successfully",
      content.commentsById
    );
  } catch (error) {
    console.error(`Error in getCommentController: ${error.message}`);
    next(error);
  }
};

export const deleteCommentController = async (req, res, next) => {
  try {
    const userId = req.token.id;
    const contentId = isValidId(req.params.contentId);
    const commentId = isValidId(req.body.commentId);

    const { type: contentType } = inputValidation(
      req.body,
      next,
      typeValidation
    );

    // Validate the contentId and commentId
    if (!contentId || !commentId) {
      return errResponse(next, "Invalid content ID or comment ID", 400);
    }

    // dynamic model
    const model = ["post", "status", "challenge"].includes(contentType)
      ? baseContentModel
      : contentType === "tagPoll"
      ? hashTagPollModel
      : hashTagPostModel;

    // Find the content and check if the comment belongs to the user
    const content = await model.findOne({
      _id: contentId,
      "commentsById._id": commentId,
      "commentsById.userId": userId,
    });

    // If the content or the comment doesn't exist, return an error
    if (!content) {
      return errResponse(
        next,
        "Comment not found or you are not the author",
        404
      );
    }

    // Perform the deletion of the comment
    const updatedContent = await baseContentModel.findByIdAndUpdate(
      contentId,
      {
        $pull: { commentsById: { _id: commentId } },
      },
      { new: true }
    );

    // If the content is not updated successfully
    if (!updatedContent) {
      return errResponse(next, "Failed to delete the comment", 500);
    }

    // Return success response
    return okResponse(res, "Comment deleted successfully", updatedContent);
  } catch (error) {
    console.error(`Error in deleteCommentController: ${error.message}`);
    next(error);
  }
};
