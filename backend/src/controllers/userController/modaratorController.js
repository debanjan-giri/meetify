import baseContentModel from "../../models/feedContentModel/baseContentModel";
import { userTypeConst } from "../../models/typeConstant.js";
import Joi from "joi";
import { okResponse } from "../../utils/reqResRelated.js";
import {
  checkType,
  inputValidation,
  isValidId,
} from "../../utils/utilityFunction";
import {
  isBoolean,
  isUserTypeInclude,
} from "../../validation/valodationSchema.js";
import baseUserModel from "../../models/accUserModel/baseUserModel.js";
import contentReportModel from "../../models/commonModel/contentReportModel.js";

export const updateUserRoleController = async (req, res, next) => {
  try {
    // check user type
    const userType = req.Token.userType;

    // check user type permission
    if (userType !== userTypeConst.ADMIN) {
      return errResponse(next, "You do not have permission", 403);
    }

    const { setUserType } = inputValidation(
      req,
      next,
      Joi.object({
        setUserType: isUserTypeInclude,
      })
    );

    const employeeId = isValidId(req.body.employeeId);

    // check if user is exists
    const isUserExist = await baseUserModel.findById(userId).lean();
    if (!isUserExist || isUserExist.userAccess === false)
      return errResponse(next, "User not found", 404);

    // update user role
    const updatedUser = await baseUserModel.findByIdAndUpdate(
      employeeId,
      { $set: { userType: setUserType } },
      { new: true }
    );
    if (!updatedUser) return errResponse(next, "User role update failed", 404);

    return okResponse(res, "User role updated successfully", updatedUser);
  } catch (error) {
    console.error(`Error in updateUserRoleController : ${error.message}`);
    next(error);
  }
};

export const blockUnblockUserController = async (req, res, next) => {
  try {
    // check user type
    const userType = req.Token.userType;
    const employeeId = isValidId(req.body.employeeId);

    // admin or hr
    if (userType !== userTypeConst.ADMIN || userType !== userTypeConst.HR) {
      return errResponse(next, "You do not have permission", 403);
    }
    const { userAccess } = inputValidation(
      req,
      next,
      Joi.object({
        userAccess: isBoolean,
      })
    );

    // Fetch the target user's details
    const targetUser = await baseUserModel
      .findById(employeeId)
      .select("userType")
      .lean();
    if (!targetUser) {
      return errResponse(next, "Target user not found", 404);
    }

    // Ensure HR cannot block/unblock an admin
    if (
      userType === userTypeConst.HR &&
      targetUser.userType === userTypeConst.ADMIN
    ) {
      return errResponse(next, "HR cannot block or unblock an admin", 403);
    }

    // Perform block/unblock action
    const updatedUserAccess = await baseUserModel.findByIdAndUpdate(
      employeeId,
      { $set: { userAccess: !!userAccess } },
      { new: true }
    );
    if (!updatedUserAccess) {
      return errResponse(next, "User update failed", 500);
    }

    // Return success response
    const actionMessage = updatedUserAccess?.userAccess
      ? "User unblocked successfully"
      : "User blocked successfully";

    return okResponse(res, actionMessage, updatedUser);
  } catch (error) {
    console.error(`Error in blockUnblockUserController : ${error.message}`);
    next(error);
  }
};

export const getAllReportedContentController = async (req, res, next) => {
  try {
    const userType = req.Token.userType;

    // admin or hr
    if (userType !== userTypeConst.ADMIN || userType !== userTypeConst.HR) {
      return errResponse(next, "You do not have permission", 403);
    }

    // find reported details
    const reportedDetails = await contentReportModel
      .find()
      .populate("reportedDetails");

    if (!reportedDetails || !reportedDetails.reportedDetails.length) {
      return errResponse(next, "No reported details found", 404);
    }

    return okResponse(res, "Reported details found", reportedDetails);
  } catch (error) {
    console.error(`Error in getReportedContentController: ${error.message}`);
    next(error);
  }
};

export const contentRemovingController = async (req, res, next) => {
  try {
    const userType = req.Token.userType;
    const creatorId = isValidId(req.body.creatorId);
    const contentId = isValidId(req.body.contentId);

    // admin or hr
    if (userType !== userTypeConst.ADMIN || userType !== userTypeConst.HR) {
      return errResponse(next, "You do not have permission", 403);
    }

    // find content is exists
    const content = await baseContentModel.findById(contentId);
    if (!content) {
      // delete content from all hr and admin
      await contentReportModel.updateMany(
        { reportedDetails: { contentId: contentId } },
        { $pull: { reportedDetails: { contentId: contentId } } }
      );
      return errResponse(next, "Content not found", 404);
    }

    // delete content
    await baseContentModel.findByIdAndDelete(contentId);

    // remove content from user
    const updatedUser = await baseUserModel.findByIdAndUpdate(
      creatorId,
      { $pull: { contendId: contentId } },
      { new: true }
    );
    if (!updatedUser) return errResponse(next, "User not found", 404);

    return okResponse(res, "Content removed successfully");
  } catch (error) {
    console.error(`Error in contentRemovedController: ${error.message}`);
    next(error);
  }
};

export const getTotalUserController = async (req, res, next) => {
  try {
    const userId = req.Token.id;
    const userType = req.Token.userType;

    // access availble for admin
    if (userType !== userTypeConst.ADMIN || userType !== userTypeConst.HR) {
      return errResponse(next, "You do not have permission", 403);
    }

    // Fetch and populate users
    const userData = await baseUserModel
      .findById(userId)
      .populate("hrId", "name email photoUrl userType")
      .populate("adminId", "name email photoUrl userType")
      .populate("employeeId", "name email photoUrl userType")
      .exec();

    if (!userData) {
      return errResponse(next, "User data not found", 404);
    }

    // find total user count
    const totalUserCount = await baseUserModel.countDocuments();
    if (totalUserCount <= 0) {
      return errResponse(next, "No users found", 404);
    }

    const allUsers = [
      { userType: "hr", ...userData.hrId },
      { userType: "admin", ...userData.adminId },
      { userType: "employee", ...userData.employeeId },
    ];

    return okResponse(res, "User data fetched successfully", {
      totalCount: totalUserCount,
      users: allUsers,
    });
  } catch (error) {
    console.error(`Error in getTotalUserController: ${error.message}`);
    next(error);
  }
};
