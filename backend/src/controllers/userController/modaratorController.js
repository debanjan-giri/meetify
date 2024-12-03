import baseContentModel from "../../models/feedContentModel/baseContentModel";
import { inputValidation, isValidId } from "../../utils/utilityFunction";

export const updateUserRoleController = async (req, res, next) => {
  try {
    // check user type
    const userType = req.Token.userType;
    const employeeId = isValidId(req.body.employeeId);

    // check user type permission
    if (userType === "employee" || userType === "hr") {
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
    const { type } = inputValidation(req, next, textValidation);

    // permission check
    if (userType === "employee") {
      return errResponse(next, "You do not have permission", 403);
    }

    // valid type
    if (!type || !["block", "unblock"].includes(type)) {
      return errResponse(next, "Invalid type provided", 400);
    }

    if (type === "block") {
      const updatedUser = await baseUserModel.findByIdAndUpdate(
        employeeId,
        { $set: { userAccess: false } },
        { new: true }
      );
      if (!updatedUser) return errResponse(next, "User not found", 404);

      return okResponse(res, "User blocked successfully", updatedUser);
    } else if (type === "unblock") {
      const updatedUser = await baseUserModel.findByIdAndUpdate(
        employeeId,
        { $set: { userAccess: true } },
        { new: true }
      );
      if (!updatedUser) return errResponse(next, "User not found", 404);

      return okResponse(res, "User unblocked successfully", updatedUser);
    } else {
      return errResponse(next, "Invalid type provided", 400);
    }
  } catch (error) {
    console.error(`Error in blockUnblockUserController : ${error.message}`);
    next(error);
  }
};

export const reportedContentController = async (req, res, next) => {
  try {
    const userId = req.Token.id;
    const { contentId } = isValidId(req.body.contentId);

    // check if content exists
    const content = await baseContentModel.findById(contentId);
    if (!content) return errResponse(next, "Content not found", 404);

    // // check if user has already reported the content
    // if (content.reported.includes(userId))
    //   return errResponse(next, "You have already reported this content", 400);
  } catch (error) {
    console.error(`Error in reportedController : ${error.message}`);
    next(error);
  }
};
