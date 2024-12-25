import baseUserModel from "../../models/accUserModel/baseUserModel.js";
import {
  contentTypeConst,
  expireTypeConst,
  privacyTypeConst,
} from "../../models/typeConstant.js";
import baseMediaModel from "../../models/unifyMedia/baseMediaModel.js";
import { errResponse, okResponse } from "../../utils/reqResRelated.js";
import {
  getExpirationDate,
  inputValidation,
  isValidId,
  removeEmptyValues,
} from "../../utils/utilityFunction.js";
import {
  isContentTypeConst,
  isExpireTypeConst,
  isPrivacyTypeConst,
} from "../../validation/typeCheckSchema.js";
import {
  isDescription,
  isId,
  isTitle,
  isUrl,
} from "../../validation/validationSchema.js";

export const createContentController = async (req, res, next) => {
  try {
    const { userId } = req?.token;

    // Validate input
    const validatedData = inputValidation(
      req.body,
      next,
      Joi.object({
        title: isTitle.required(),
        description: isDescription.optional(),
        photoUrl: isUrl.optional(),
        contentType: isContentTypeConst.required(),
        privacyType: isPrivacyTypeConst.required(),
        hashTagedId: isId.optional(),
        expireType: isExpireTypeConst.required(),
      })
    );

    // Filter out empty values
    const payload = removeEmptyValues(validatedData);

    // Check if no valid fields provided
    if (!Object.keys(payload).length) {
      return errResponse(
        next,
        "No valid fields provided for creating content",
        400
      );
    }

    // Build expiration date based on expiration type
    const expirationDate = getExpirationDate(payload?.expireType);
    const expiresAt =
      payload.contentType === contentTypeConst.STATUS ||
      payload.contentType === contentTypeConst.CHALLENGE
        ? new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours for STATUS or CHALLENGE
        : expirationDate;

    if (payload.contentType === contentTypeConst.STATUS && !payload.photoUrl) {
      return errResponse(next, "Photo URL is required for status", 400);
    }

    // Initialize base content payload
    const basePayload = {
      creatorId: userId,
      contentType: payload.contentType,
      title: payload.title,
      description:
        payload.contentType === contentTypeConst.STATUS
          ? ""
          : payload.description,
      photoUrl: payload.photoUrl,
      privacyType:
        payload.privacyType === contentTypeConst.HASHTAG
          ? privacyTypeConst.PUBLIC
          : payload.privacyType,
      expiresAt,
    };

    // Create the content document
    const content = await baseMediaModel.create(basePayload);

    if (!content) {
      return errResponse(next, "Content not created", 400);
    }

    // Check if hashtag update is required
    if (
      payload.contentType === contentTypeConst.HASHTAG &&
      payload.hashTagedId
    ) {
      await hashTagModel.findByIdAndUpdate(
        payload.hashTagedId,
        {
          $push: {
            contentArray: { creatorId: userId, contentId: content._id },
          },
        },
        { new: true }
      );
    }

    // Update the user's model with the created content ID
    await baseUserModel.updateOne(
      { _id: userId },
      { $push: { myContentIds: content._id } }
    );

    // Respond with success
    return okResponse(res, "Content created successfully");
  } catch (error) {
    console.error(`Error in createContentController: ${error.message}`);
    return next(error);
  }
};

export const getAllContentController = async (req, res, next) => {
  try {
    const { userId } = req?.token;
    const { cursor, limit = 10 } = inputValidation(
      req.query,
      next,
      Joi.object({
        cursor: isString.required(),
        limit: isNumber.required(),
      })
    );

    const isValidCursor = isValidId(next, cursor);

    // Validate limit
    const pageSize = Math.min(parseInt(limit, 10) || 10, 100);

    // Build query
    const query = { creatorId: userId };
    if (isValidCursor) {
      query.createdAt = { $lt: new Date(isValidCursor) };
    }

    // Fetch content
    const contentList = await baseMediaModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .select("title photoUrl id")
      .lean();

    // Determine the next cursor
    const nextCursor = contentList.length
      ? contentList[contentList.length - 1].createdAt
      : null;

    return okResponse(res, "Content fetched successfully", {
      content: contentList,
      nextCursor,
      hasNextPage: !!nextCursor,
    });
  } catch (error) {
    console.error(`Error in getAllContentController: ${error.message}`);
    return next(error);
  }
};

export const getContentDetailsByIdController = async (req, res, next) => {
  try {
    const userId = req?.Token?.id; // Authenticated user's ID
    const { contentId } = inputValidation(
      req.params,
      next,
      Joi.object({
        contentId: isId.required(), // Ensure a valid content ID
      })
    );

    // Build the query to fetch content along with privacy checks directly
    const content = await baseMediaModel
      .findOne({
        _id: contentId,
        $or: [
          { creatorId: userId }, // Creator can always view the content
          { privacyType: privacyTypeConst.PUBLIC }, // Public content can be viewed by anyone
          { allowedPrivacyIds: userId }, // User is explicitly allowed
        ],
      })
      .select(
        "title description photoUrl privacyType creatorId allowedPrivacyIds createdAt"
      )
      .lean();

    if (!content) {
      return errResponse(
        next,
        "Content not found or you do not have permission to view it",
        403
      );
    }

    return okResponse(res, "Content details fetched successfully", content);
  } catch (error) {
    console.error(`Error in getContentDetailsByIdController: ${error.message}`);
    return next(error);
  }
};

export const deleteContentByIdController = async (req, res, next) => {
  try {
    const userId = req?.Token?.id; // Authenticated user's ID
    const { contentId } = inputValidation(
      req.params,
      next,
      Joi.object({
        contentId: isId.required(), // Ensure valid content ID
      })
    );

    // Perform both ownership validation and deletion in one query
    const content = await baseMediaModel
      .findOneAndDelete({
        _id: contentId,
        creatorId: userId, // Ensure the user is the owner
      })
      .select("_id")
      .lean();

    if (!content) {
      return errResponse(
        next,
        "Content not found or not authorized to delete",
        404
      );
    }

    // Remove the content ID from the user's `myConnectionIds` in parallel
    await baseUserModel
      .updateOne({ _id: userId }, { $pull: { myConnectionIds: contentId } })
      .select("")
      .lean();

    return okResponse(res, "Content deleted successfully");
  } catch (error) {
    console.error(`Error in deleteContentByIdController: ${error.message}`);
    return next(error);
  }
};
