import baseContentModel from "../../models/feedContentModel/baseContentModel";
import baseUserModel from "../../models/userModel/baseUserModel.js";
import { okResponse } from "../../utils/reqResRelated.js";
import { inputValidation, isValidId } from "../../utils/utilityFunction";

export const updateUserRoleController = async (req, res, next) => {
  try {
    // check user type
    const userType = req.Token.userType;
    const employeeId = isValidId(req.body.employeeId);

    // check user type permission
    if (userType !== "admin") {
      return errResponse(next, "You do not have permission", 403);
    }

    // check if user is exists
    const user = await baseUserModel.findById(employeeId);
    if (!user) return errResponse(next, "User not found", 404);

    // update user role
    const updatedUser = await baseUserModel.findByIdAndUpdate(
      employeeId,
      { $set: { userType: userType } },
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
    const { type } = inputValidation(req, next, typeValidation);

    // admin or hr
    if (userType !== "admin" || userType !== "hr") {
      return errResponse(next, "You do not have permission", 403);
    }

    // valid type
    if (!type || !["block", "unblock"].includes(type)) {
      return errResponse(next, "Invalid type provided", 400);
    }

    // Fetch the target user's details
    const targetUser = await baseUserModel.findById(employeeId);
    if (!targetUser) {
      return errResponse(next, "Target user not found", 404);
    }

    // Ensure HR cannot block/unblock an admin
    if (userType === "hr" && targetUser.userType === "admin") {
      return errResponse(next, "HR cannot block or unblock an admin", 403);
    }

    // Perform block/unblock action
    const updatedUser = await baseUserModel.findByIdAndUpdate(
      employeeId,
      { $set: { userAccess: type === "block" ? false : true } },
      { new: true }
    );
    if (!updatedUser) {
      return errResponse(next, "User update failed", 500);
    }

    // Return success response
    const actionMessage =
      type === "block"
        ? "User blocked successfully"
        : "User unblocked successfully";
    return okResponse(res, actionMessage, updatedUser);
  } catch (error) {
    console.error(`Error in blockUnblockUserController : ${error.message}`);
    next(error);
  }
};

export const submitReportedController = async (req, res, next) => {
  try {
    const userId = req.Token.id;
    const { contentId, autherId } = req.body;

    // Validate content ID
    const validContentId = isValidId(contentId);
    if (!validContentId) return errResponse(next, "Invalid content ID", 400);

    // Validate auther ID
    const validAutherId = isValidId(autherId);
    if (!validAutherId) return errResponse(next, "Invalid auther ID", 400);

    // Check if content exists
    const content = await baseContentModel.findById(contentId);
    if (!content) return errResponse(next, "Content not found", 404);

    const reportDetails = {
      contentId: validContentId,
      authorId: validAutherId,
      reportedById: userId,
    };

    // Find all admins and HRs and put reported details
    const adminsAndHRs = await baseUserModel.find({
      userType: { $in: ["admin", "hr"] },
    });

    if (!adminsAndHRs.length)
      return errResponse(next, "No admins or HRs found", 404);

    // Update field
    const updatePromises = adminsAndHRs.map((user) =>
      baseUserModel.findByIdAndUpdate(
        user._id,
        { $push: { reportedDetails: reportDetails } },
        { new: true }
      )
    );

    // Await all updates
    await Promise.all(updatePromises);

    return okResponse(
      res,
      "Reported content successfully updated for admins and HRs"
    );
  } catch (error) {
    console.error(`Error in reportedContentController: ${error.message}`);
    next(error);
  }
};

export const getReportedContentController = async (req, res, next) => {
  try {
    const userId = req.Token.id;
    const userType = req.Token.userType;

    // admin or hr
    if (userType !== "admin" || userType !== "hr") {
      return errResponse(next, "You do not have permission", 403);
    }

    // find reported details
    const reportedDetails = await baseUserModel
      .findById(userId)
      .select("reportedDetails");

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
    const autherId = isValidId(req.body.autherId);
    const contentId = isValidId(req.body.contentId);

    // admin or hr
    if (userType !== "admin" || userType !== "hr") {
      return errResponse(next, "You do not have permission", 403);
    }

    // find content is exists
    const content = await baseContentModel.findById(contentId);
    if (!content) {
      // delete content from all hr and admin
      await baseUserModel.updateMany(
        { userType: { $in: ["admin", "hr"] } },
        { $pull: { reportedDetails: { contentId: contentId } } }
      );
      return errResponse(next, "Content not found", 404);
    }

    // delete content
    await baseContentModel.findByIdAndDelete(contentId);

    // remove content from user
    const updatedUser = await baseUserModel.findByIdAndUpdate(
      autherId,
      { $pull: { contendId: contentId } },
      { new: true }
    );
    if (!updatedUser) return errResponse(next, "User not found", 404);

    // all reported details from all admin and hr
    await baseUserModel.updateMany(
      { userType: { $in: ["admin", "hr"] } },
      { $pull: { reportedDetails: { contentId: contentId } } }
    );

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
    if (userType !== "admin" || userType !== "hr") {
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
