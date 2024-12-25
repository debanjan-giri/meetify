import { userTypeConst } from "../../models/typeConstant.js";
import Joi from "joi";
import { errResponse, okResponse } from "../../utils/reqResRelated.js";
import { inputValidation, isValidId } from "../../utils/utilityFunction.js";
import {
  isBoolean,
  isId,
  isNumber,
  isString,
} from "../../validation/validationSchema.js";
import baseMediaModel from "../../models/unifyMedia/baseMediaModel.js";
import { isUserType } from "../../validation/typeCheckSchema.js";
import baseUserModel from "../../models/accUserModel/baseUserModel.js";

export const updateUserRoleController = async (req, res, next) => {
  try {
    // check user type
    const { userType } = req.token;

    // check user type permission
    if (userType !== userTypeConst.ADMIN) {
      return errResponse(next, "You do not have permission", 403);
    }

    // user payload
    const { setUserType, accountId } = inputValidation(
      req.body,
      next,
      Joi.object({
        setUserType: isUserType.required(),
        accountId: isId.required(),
      })
    );
    const isAccountId = isValidId(next, accountId);

    let updatedData = { userType: setUserType };

    if (setUserType === userTypeConst.HR) {
      updatedData = {
        ...updatedData,
        hrIds: user.hrIds || [],
        adminIds: user.adminIds || [],
        employeeIds: user.employeeIds || [],
      };
    }

    const updatedUser = await baseUserModel
      .findOneAndUpdate(
        { _id: isAccountId, email: { $ne: process.env.ADMIN_EMAIL } },
        { $set: updatedData },
        { new: true }
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
    const { userType } = req.token;
    const { accountId, userAccess } = inputValidation(
      req.body,
      next,
      Joi.object({
        accountId: isId.required(),
        userAccess: isBoolean.required(),
      })
    );
    const isAccountId = isValidId(next, accountId);

    // admin or hr
    if (![userTypeConst.ADMIN, userTypeConst.HR].includes(userType)) {
      return errResponse(next, "You do not have permission", 403);
    }
    // Perform block/unblock action
    const updatedUser = await baseUserModel
      .findOneAndUpdate(
        { _id: isAccountId, email: { $ne: process.env.ADMIN_EMAIL } },
        { $set: { userAccess: userAccess } },
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
    const { userType } = req.token;

    const { cursor, limit = 10 } = inputValidation(
      req.query,
      next,
      Joi.object({
        cursor: isString.optional(),
        limit: isNumber.optional(),
      })
    );

    // Validate limit
    const limitValue = parseInt(limit, 10);
    if (isNaN(limitValue) || limitValue <= 0 || limitValue > 100) {
      return errResponse(next, "Invalid limit value", 400);
    }

    // Admin or HR permissions
    if (![userTypeConst.ADMIN, userTypeConst.HR].includes(userType)) {
      return errResponse(next, "You do not have permission", 403);
    }

    // Build query
    const query = { isReported: true };
    if (cursor) {
      query._id = { $gt: cursor };
    }

    // Find reported content details with cursor-based pagination
    const reportedDetails = await baseMediaModel
      .find(query)
      .select(
        "_id reportedObj.creatorEmail reportedObj.reportedByEmail creatorId"
      )
      .limit(limitValue)
      .lean();

    if (!reportedDetails || reportedDetails.length === 0) {
      return errResponse(next, "No reported details found", 404);
    }

    // Return the next cursor
    const nextCursor =
      reportedDetails.length === limit
        ? reportedDetails[reportedDetails.length - 1]._id
        : null;

    return okResponse(res, {
      message: "Reported details found",
      data: reportedDetails,
      nextCursor,
    });
  } catch (error) {
    console.error(`Error in getReportedContentController: ${error.message}`);
    next(error);
  }
};

export const contentRemovedController = async (req, res, next) => {
  try {
    const { userType } = req.token;

    // Validate input
    const { contentId, accountId } = inputValidation(
      req.body,
      next,
      Joi.object({
        contentId: isId.required(),
        accountId: isId.required(),
      })
    );
    const isContentId = isValidId(next, contentId);
    const isAccountId = isValidId(next, accountId);

    // Check permissions
    if (![userTypeConst.ADMIN, userTypeConst.HR].includes(userType)) {
      return errResponse(next, "You do not have permission", 403);
    }

    // Perform the delete and update operations concurrently
    const [deletedContent, updatedUser] = await Promise.all([
      baseMediaModel.findByIdAndDelete(isContentId),
      baseUserModel.findOneAndUpdate(
        { _id: isAccountId },
        { $pull: { myContentIds: contentId } },
        { new: true }
      ),
    ]);

    // Check if content was found and deleted
    if (!deletedContent) {
      return errResponse(next, "Content not found or already deleted", 404);
    }

    // Check if the user exists and content reference was removed
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
    const { userType } = req.token;

    // Validate input
    const { contentId } = inputValidation(
      req.body,
      next,
      Joi.object({
        contentId: isId.required(),
      })
    );

    const isContentId = isValidId(contentId);

    // Check permissions
    if (![userTypeConst.ADMIN, userTypeConst.HR].includes(userType)) {
      return errResponse(next, "You do not have permission", 403);
    }

    const updatedContent = await baseMediaModel.findByIdAndUpdate(
      isContentId,
      { $set: { isReported: false, reportedObj: {} } },
      { new: true }
    );

    if (!updatedContent) {
      return errResponse(next, "Content not found", 404);
    }

    return okResponse(res, "Reported status undone successfully");
  } catch (error) {
    console.error(`Error in undoReportedContentController: ${error.message}`);
    next(error);
  }
};
