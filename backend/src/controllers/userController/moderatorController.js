import { userTypeConst } from "../../models/typeConstant.js";
import Joi from "joi";
import { errResponse, okResponse } from "../../utils/reqResRelated.js";
import { inputValidation, isValidId } from "../../utils/utilityFunction.js";
import {
  isBoolean,
  isEmail,
  isId,
  isName,
  isUserType,
} from "../../validation/validationSchema.js";
import baseUserModel from "../../models/accUserModel/baseUserModel.js";
import baseMediaModel from "../../models/unifyMedia/baseMediaModel.js";

export const updateUserRoleController = async (req, res, next) => {
  try {
    // check user type
    const userType = req.token.userType;

    // check user type permission
    if (userType !== userTypeConst.ADMIN) {
      return errResponse(next, "You do not have permission", 403);
    }

    // user payload
    const { setUserType, employeeId } = inputValidation(
      req.body,
      next,
      Joi.object({
        setUserType: isUserType,
        employeeId: isId,
      })
    );
    const validEmployeeId = isValidId(next, employeeId);

    // Update user role in a single query
    const updatedUser = await baseUserModel
      .findOneAndUpdate(
        {
          _id: validEmployeeId,
          userAccess: true,
          email: { $ne: process.env.ADMIN_EMAIL },
        },
        { $set: { userType: setUserType } },
        { new: true, select: "-_id" }
      )
      .lean();

    if (!updatedUser) {
      return errResponse(next, "User not found", 404);
    }

    return okResponse(res, "User role updated successfully");
  } catch (error) {
    console.error(`Error in updateUserRoleController : ${error.message}`);
    next(error);
  }
};

export const blockUnblockUserController = async (req, res, next) => {
  try {
    // check user type
    const userType = req.token.userType;
    const { employeeId, userAccess } = inputValidation(
      req.body,
      next,
      Joi.object({
        employeeId: isId,
        userAccess: isBoolean,
      })
    );
    const validEmployeeId = isValidId(next, employeeId);

    // admin or hr
    if (![userTypeConst.ADMIN, userTypeConst.HR].includes(userType)) {
      return errResponse(next, "You do not have permission", 403);
    }
    // Perform block/unblock action
    const updatedUser = await baseUserModel
      .findOneAndUpdate(
        { _id: validEmployeeId, email: { $ne: process.env.ADMIN_EMAIL } },
        { $set: { userAccess: !!userAccess } },
        { new: true, select: " -_id" }
      )
      .lean();

    if (!updatedUser) {
      return errResponse(next, "User update failed", 500);
    }

    // Return success response
    const actionMessage = updatedUser?.userAccess
      ? "User unblocked successfully"
      : "User blocked successfully";

    return okResponse(res, actionMessage);
  } catch (error) {
    console.error(`Error in blockUnblockUserController : ${error.message}`);
    next(error);
  }
};

export const getReportedContentController = async (req, res, next) => {
  try {
    const userType = req.token.userType;

    // admin or hr
    if (![userTypeConst.ADMIN, userTypeConst.HR].includes(userType)) {
      return errResponse(next, "You do not have permission", 403);
    }

    // Add pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Find reported content details
    const reportedDetails = await baseMediaModel
      .find({ isReported: true })
      .select("_id  reportedArray.creatorEmail reportedArray.reportedByEmail")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    if (!reportedDetails || reportedDetails.length === 0) {
      return errResponse(next, "No reported details found", 404);
    }

    return okResponse(res, "Reported details found");
  } catch (error) {
    console.error(`Error in getReportedContentController: ${error.message}`);
    next(error);
  }
};

export const contentRemovedController = async (req, res, next) => {
  try {
    const userType = req.token.userType;

    // Validate input
    const { creatorId, contentId } = inputValidation(
      req.body,
      next,
      Joi.object({
        creatorId: isId,
        contentId: isId,
      })
    );

    const isCreatorId = isValidId(creatorId);
    const isContentId = isValidId(contentId);

    // Check permissions
    if (![userTypeConst.ADMIN, userTypeConst.HR].includes(userType)) {
      return errResponse(next, "You do not have permission", 403);
    }

    // Delete content
    const deletedContent = await baseMediaModel
      .findByIdAndDelete(isContentId)
      .select("_id")
      .lean();

    if (!deletedContent) {
      return errResponse(next, "Content not found or already deleted", 404);
    }

    // Remove content reference from user
    const updatedUser = await baseUserModel
      .findOneAndUpdate(
        { _id: isCreatorId },
        { $pull: { myContendIds: isContentId } },
        { new: true }
      )
      .select("_id")
      .lean();

    if (!updatedUser) {
      return errResponse(next, "User not found", 404);
    }

    return okResponse(res, "Content removed successfully");
  } catch (error) {
    console.error(`Error in contentRemovedController: ${error.message}`);
    next(error);
  }
};

export const undoReportedContentController = async (req, res, next) => {
  try {
    const userType = req.token.userType;

    // Validate input
    const { contentId } = inputValidation(
      req.body,
      next,
      Joi.object({
        contentId: isId,
      })
    );

    const isContentId = isValidId(contentId);

    // Check permissions
    if (![userTypeConst.ADMIN, userTypeConst.HR].includes(userType)) {
      return errResponse(next, "You do not have permission", 403);
    }

    const updatedContent = await baseMediaModel
      .findByIdAndUpdate(
        isContentId,
        { $set: { isReported: false, reportedArray: {} } },
        { new: true }
      )
      .select("_id")
      .lean();

    if (!updatedContent) {
      return errResponse(next, "Content not found", 404);
    }

    return okResponse(res, "Reported status undone successfully");
  } catch (error) {
    console.error(`Error in undoReportedContentController: ${error.message}`);
    next(error);
  }
};

export const submitReportController = async (req, res, next) => {
  try {
    const email = req?.Token?.email;

    // Validate input
    const { contentId } = inputValidation(
      req.body,
      next,
      Joi.object({
        contentId: isId,
      })
    );

    const isContentId = isValidId(next, contentId);

    // Update reported details
    const updatedContent = await baseMediaModel
      .findByIdAndUpdate(
        isContentId,
        {
          $set: {
            isReported: true,
            reportedArray: {
              reportedByEmail: email,
            },
          },
        },
        { new: true }
      )
      .select("-_id")
      .lean();

    if (!updatedContent) {
      return errResponse(next, "Content not found", 404);
    }

    return okResponse(res, "Report status updated successfully");
  } catch (error) {
    console.error(`Error in submitReportController: ${error.message}`);
    next(error);
  }
};
