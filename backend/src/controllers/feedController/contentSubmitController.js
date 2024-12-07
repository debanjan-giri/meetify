import baseContentModel from "../../models/feedContentModel/baseContentModel.js";
import statusModel from "../../models/feedContentModel/statusModel.js";
import { errResponse, okResponse } from "../../utils/reqResRelated.js";
import {
  getCleanHashTag,
  inputValidation,
  isValidId,
} from "../../utils/utilityFunction.js";
import { createContentValidation } from "../../validation/validationSchema.js";

export const createContentController = async (req, res, next) => {
  try {
    const userId = req?.Token?.id;

    // input validation
    const {
      title,
      description,
      photoUrl,
      type,
      hashTag,
      challengeTitle,
      privacyType,
      selectedIds,
    } = inputValidation(req, next, createContentValidation);

    // check type
    const allowedTypes = ["post", "status", "challenge"];
    if (!allowedTypes.includes(type)) {
      return errResponse(next, "Invalid type provided", 400);
    }

    // Handle privacy options
    let customIds = [];

    if (privacyType === "friends") {
      const user = await baseUserModel.findById(userId);
      customIds = user.connectionId;
    } else if (
      privacyType === "custom" &&
      selectedIds &&
      selectedIds.length > 0
    ) {
      customIds = selectedIds;
    }

    // dynamic model
    let model = type === "status" ? statusModel : baseContentModel;

    const contentPayload = {
      contentType: type,
      title: type === "challenge" ? challengeTitle : title,
      description,
      photoUrl,
      userId,
      privacy: privacyType,
      selectedPrivacyIds: customIds,
    };

    // Create and save content
    const content = new model(contentPayload);
    await content.save();

    // add content to user
    const updatedUser = await baseUserModel.findByIdAndUpdate(
      userId,
      { $push: { contendId: content._id } },
      { new: true }
    );
    if (!updatedUser) return errResponse(next, "User not found", 404);

    // update hash tag if present
    const hashTagName = getCleanHashTag(hashTag);

    // find hash tag and add update
    if (hashTagName && type !== "status") {
      const hashTagData = await hashTagModel.findOne({ hashTagName });
      if (hashTagData) {
        hashTagData.submitedById.push({ userId, dataId: content._id });
        await hashTagData.save();
      }
    }

    return okResponse(res, "Content created successfully", content);
  } catch (error) {
    console.error(`Error in createContentController : ${error.message}`);
    next(error);
  }
};

export const getMyContentController = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const { type } = req.query;

    // check type
    const allowedTypes = ["post", "status", "challenge"];
    if (!allowedTypes.includes(type?.trim())) {
      return errResponse(next, "Invalid type provided", 400);
    }

    // dynamic model
    let model = type === "status" ? statusModel : baseContentModel;

    // Fetch all content
    const content = await model
      .find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (!content || content.length === 0) {
      return errResponse(next, "No content found", 404);
    }

    return okResponse(res, "Content fetched successfully", content);
  } catch (error) {
    console.error(`Error in getAllContentController: ${error.message}`);
    next(error);
  }
};

export const deleteMyContentController = async (req, res, next) => {
  try {
    const contentId = isValidId(req.body.contentId);

    // find content is exists
    const content = await baseContentModel.findById(contentId);
    if (!content) return errResponse(next, "Content not found", 404);

    // delete content
    const deletedContent = await baseContentModel.findByIdAndDelete(contentId);
    if (!deletedContent)
      return errResponse(next, "Content not deleted successfully", 404);

    // remove content from user
    const userId = req.token.id;
    const updatedUser = await baseUserModel.findByIdAndUpdate(
      userId,
      { $pull: { contendId: contentId } },
      { new: true }
    );
    if (!updatedUser) return errResponse(next, "User content not found", 404);

    return okResponse(res, "Content deleted successfully");
  } catch (error) {
    console.error(`Error in deleteMyContentController: ${error.message}`);
    next(error);
  }
};
