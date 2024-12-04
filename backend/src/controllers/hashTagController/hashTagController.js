import hashTagModel from "../../models/hasTagModel/hashTagModel";
import { inputValidation } from "../../utils/utilityFunction";
import { hashTagSubmitValidation } from "../../validation/validationSchema";

export const createHashTagController = async (req, res, next) => {
  try {
    const userId = req?.Token?.id;
    const userType = req?.Token?.userType;

    const { hashTag } = inputValidation(req, next, hashTagSubmitValidation);

    // create hash tag
    const hashTagDetails = await hashTagModel.create({
      hashTag,
      creatorId: userId,
      userType,
    });

    if (!hashTagDetails) {
      return errResponse(next, "Hash tag not created", 400);
    }

    return okResponse(res, "Hash tag created successfully", hashTagDetails);
  } catch (error) {
    console.error(`Error in createHashTagController : ${error.message}`);
    next(error);
  }
};