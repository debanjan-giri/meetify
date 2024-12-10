import {
  inputValidation,
  isValidId,
  isValidId,
} from "../../utils/utilityFunction.js";
import { errResponse, okResponse } from "../../utils/reqResRelated.js";
import {
  isBio,
  isCompany,
  isRequestype,
  isDateOfBirth,
  isDesignation,
  isId,
  isNumber,
  isString,
  isUrl,
  isZeroOneType,
} from "../../validation/validationSchema.js";
import baseUserModel from "../../models/accUserModel/baseUserModel.js";
import { isRequestypeConst } from "../../models/typeConstant.js";

export const upateDetailsController = async (req, res, next) => {
  try {
    const userId = req?.Token?.id;

    // Validate request data
    const validatedData = inputValidation(
      req.body,
      next,
      Joi.object({
        name: Joi.string().trim(),
        bio: isBio,
        company: isCompany,
        dateOfBirth: isDateOfBirth,
        designation: isDesignation,
      })
    );

    // prevent unnecessary updates
    const updatePayload = Object.fromEntries(
      Object.entries(validatedData).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
    );

    // If no valid fields are provided, skip the DB write
    if (Object.keys(updatePayload).length === 0) {
      return errResponse(next, "No valid fields provided for update", 400);
    }

    // update user details
    const updatedUser = await baseUserModel
      .findByIdAndUpdate(userId, updatePayload, { new: true })
      .select("")
      .lean();
    if (!updatedUser)
      return errResponse(next, "User details update failed", 404);

    // send response
    return okResponse(res, "User details updated successfully");
  } catch (error) {
    console.error(`Error in upateDetailsController : ${error.message}`);
    next(error);
  }
};

export const getDetailsByIdController = async (req, res, next) => {
  try {
    const { id: employeeId } = inputValidation(
      req.params,
      next,
      Joi.object({
        id: isId,
      })
    );
    const isEmployeeId = isValidId(next, employeeId);

    // get user details
    const user = await baseUserModel
      .findById(isEmployeeId)
      .select("name profilePhoto bio company designation userType")
      .lean();
    if (!user) return errResponse(next, "User not found", 404);

    // send response
    return okResponse(res, "User details fetched successfully", user);
  } catch (error) {
    console.error(`Error in getDetailsByIdController : ${error.message}`);
    next(error);
  }
};

export const submitUnsubmitPhotoUrlController = async (req, res, next) => {
  try {
    const userId = req?.Token?.id;

    const { profilePhoto, isSubmit } = inputValidation(
      req.body,
      next,
      Joi.object({
        profilePhoto: isUrl,
        isSubmit: isZeroOneType,
      })
    );

    // Prepare update data
    const updateData =
      isSubmit === 1 ? { profilePhoto } : { profilePhoto: null };

    // Update user details
    const updatedUser = await baseUserModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .select("")
      .lean();

    if (!updatedUser) {
      return errResponse(next, "User profile photo update failed", 404);
    }

    // Send response
    return okResponse(res, "User details updated successfully");
  } catch (error) {
    console.error(
      `Error in submitUnsubmitPhotoUrlController: ${error.message}`
    );
    next(error);
  }
};

export const getMyDetailsController = async (req, res, next) => {
  try {
    const userId = req?.Token?.id;

    // get user details
    const user = await baseUserModel
      .findById(userId)
      .select(
        "-myConnectionIds -myContendIds -myFdRequestIds -userAccess -password"
      )
      .lean();
    if (!user) return errResponse(next, "User not found", 404);

    // send response
    return okResponse(res, "User details fetched successfully", user);
  } catch (error) {
    console.error(`Error in getMyDetailsController : ${error.message}`);
    next(error);
  }
};

export const getUserListController = async (req, res, next) => {
  try {
    // Validate request data
    const { cursor, limit = 10 } = inputValidation(
      req.query,
      next,
      Joi.object({
        cursor: isString,
        limit: isNumber,
      })
    );

    // Validate limit
    const limitValue = parseInt(limit, 10);
    if (isNaN(limitValue) || limitValue <= 0 || limitValue > 100) {
      return errResponse(next, "Invalid limit value", 400);
    }

    // Build query
    const query = cursor ? { _id: { $gt: cursor } } : {};

    // Fetch users from the database
    const users = await baseUserModel
      .find(query)
      .sort({ _id: 1 })
      .limit(limitValue)
      .select("name profilePhoto bio")
      .lean();

    // If no users are found
    if (!users.length) {
      return okResponse(res, "No users found", { users: [] });
    }

    // Get the next cursor
    const nextCursor = users[users.length - 1]?._id;

    // Send response with users and pagination info
    return okResponse(res, "User list fetched successfully", {
      users,
      nextCursor,
      hasNextPage: users.length === limitValue,
    });
  } catch (error) {
    console.error(`Error in getUserListController: ${error.message}`);
    next(error);
  }
};

export const handleConnectionController = async (req, res, next) => {
  try {
    const userId = req?.Token?.id;
    const { requestype, employeeId } = inputValidation(
      req.body,
      next,
      Joi.object({ requestype: isRequestype, employeeId: isId })
    );

    const isEmployeeId = isValidId(next, employeeId);

    const updateConnection = async (userId, employeeId, update) => {
      const updatedUser = await baseUserModel
        .findByIdAndUpdate(userId, update, { new: true })
        .select("")
        .lean();
      if (!updatedUser) {
        return false;
      }
      return true;
    };

    let successMessage = "";
    let update = {};

    switch (requestype) {
      case isRequestypeConst.SEND:
        update = { $addToSet: { myFdRequestIds: userId } };
        successMessage = "Connection request sent successfully";
        break;

      case isRequestypeConst.ACCEPT:
        update = {
          $addToSet: { connectionId: isEmployeeId },
          $pull: { requestId: isEmployeeId },
        };
        successMessage = "Connection request accepted successfully";
        break;

      case isRequestypeConst.REJECT:
        update = { $pull: { requestId: isEmployeeId } };
        successMessage = "Connection request rejected successfully";
        break;

      case isRequestypeConst.DELETE:
        update = { $pull: { requestId: isEmployeeId } };
        successMessage = "Connection request deleted successfully";
        break;

      default:
        return errResponse(next, "Invalid request type", 400);
    }

    const updated = await updateConnection(userId, isEmployeeId, update);

    if (!updated) {
      return errResponse(next, `${successMessage.split(" ")[0]} failed`, 404);
    }

    return okResponse(res, successMessage);
  } catch (error) {
    console.error(`Error in handleConnectionController: ${error.message}`);
    next(error);
  }
};

export const connectedRequestListController = async (req, res, next) => {
  try {
    const userId = req?.Token?.id;

    // Validate request data using Joi schema
    const {
      cursor,
      limit = 10,
      type,
    } = inputValidation(
      req.query,
      next,
      Joi.object({
        cursor: isString,
        limit: isNumber,
        type: isZeroOneType,
      })
    );

    // Validate 'limit'
    const limitValue = Math.min(Math.max(parseInt(limit, 10), 1), 100); // Ensure limit is within range
    if (isNaN(limitValue)) return errResponse(next, "Invalid limit value", 400);

    // Determine query based on 'type'
    const query = {
      [`my${type === 1 ? "Connection" : "FdRequest"}Ids`]: userId,
    };

    // Apply cursor-based pagination if provided
    if (cursor) query._id = { $gt: cursor };

    // Fetch the user list
    const userList = await baseUserModel
      .find(query)
      .sort({ _id: 1 })
      .limit(limitValue)
      .select("name profilePhoto bio")
      .lean();

    // No users found
    if (!userList.length) {
      return okResponse(res, "No users found", { connections: [] });
    }

    // Get the next cursor (next _id)
    const nextCursor = userList[userList.length - 1]._id;

    // Send response with user data and pagination info
    return okResponse(
      res,
      `${type === 1 ? "Connected" : "Requested"} list fetched successfully`,
      {
        connections: userList,
        nextCursor,
        hasNextPage: userList.length === limitValue, // Check if there are more pages
      }
    );
  } catch (error) {
    console.error(`Error in connectedRequestListController: ${error.message}`);
    next(error); // Pass error to next middleware
  }
};
