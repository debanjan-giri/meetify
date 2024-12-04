import baseContentModel from "../../models/feedContentModel/baseContentModel";
import hashTagPollModel from "../../models/hasTagModel/hashTagPollModel";
import hashTagPostModel from "../../models/hasTagModel/hashTagPostModel";

export const getContentByIdController = async (req, res, next) => {
  try {
    const contentId = isValidId(req.body.contentId);
    const { type: contentType } = inputValidation(req, next, typeValidation);

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

    // find content is exists
    const content = await model.findById(contentId);
    if (!content) return errResponse(next, "Content not found", 404);

    // check this user own this content in db
    const isOwnContent = await model.findOne({
      contendId: contentId,
    });
    if (!isOwnContent) return errResponse(next, "Content not found", 404);

    // return content
    return okResponse(res, "Content fetched successfully", content);
  } catch (error) {
    console.error(`Error in getContentByIdController: ${error.message}`);
    next(error);
  }
};

export const likeSubmitController = async (req, res, next) => {
  try {
  } catch (error) {
    console.log(`Error in likeSubmitController ${error}`);
    next(error);
  }
};
