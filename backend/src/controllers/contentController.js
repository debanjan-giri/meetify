import baseUserModel from "../../models/accUserModel/baseUserModel.js";
import baseContentModel from "../../models/feedContentModel/baseContentModel.js";
import { errResponse, okResponse } from "../../utils/reqResRelated.js";
import { inputValidation } from "../../utils/utilityFunction.js";
import {
  isContentTypeConst,
  isExpirationTypeConst,
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
    const userId = req?.Token?.id;

    // Validate input
    const validatedData = inputValidation(
      req.body,
      next,
      Joi.object({
        title: isTitle.required(), // required
        description: isDescription.optional(),
        photoUrl: isUrl.optional(),
        contentType: isContentTypeConst.required(), // required
        privacyType: isPrivacyTypeConst.required(), // required
        allowedIds: Joi.array().items(isId).optional(), // ensure valid ObjectId array
        hashTagedId: isId.optional(),
        expirationType: isExpirationTypeConst.required(),
      })
    );

    // Filter out undefined, null, or empty values
    const updatePayload = Object.fromEntries(
      Object.entries(validatedData).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
    );

    // Check for missing fields
    if (!Object.keys(updatePayload).length > 0) {
      return errResponse(
        next,
        "No valid fields provided for creating content",
        400
      );
    }

    // Add creator ID
    updatePayload.creatorId = userId;

    // Create the content document
    const content = await baseMediaModel.create(updatePayload);

    if (!content) {
      return errResponse(next, "Content not created", 400);
    }

    // Update the user's model with the created content ID
    await baseUserModel
      .findByIdAndUpdate(userId, {
        $push: { myConnectionIds: content._id },
      })
      .select("")
      .lean();

    // Respond with success
    return okResponse(res, "Content created successfully");
  } catch (error) {
    console.error(`Error in createContentController: ${error.message}`);
    return next(error);
  }
};

export const getAllContentController = async (req, res, next) => {
  try {
    const userId = req?.Token?.id;
    const { cursor, limit = 10 } = inputValidation(
      req.query,
      next,
      Joi.object({
        cursor: isString.required(),
        limit: isNumber.required(),
      })
    );

    // Validate limit
    const pageSize = Math.min(parseInt(limit, 10) || 10, 100);

    // Build query
    const query = { creatorId: userId };
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
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
