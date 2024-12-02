import hrModel from "../../models/userModel/hrModel.js";
import adminModel from "../../models/userModel/adminModel.js";
import employeeModel from "../../models/userModel/employeeModel.js";

import { updateDetailsValidation } from "../../validation/validationSchema.js";
import { inputValidation } from "../../utils/utilityFunction.js";
import { errResponse, okResponse } from "../../utils/reqResRelated.js";

export const upateDetailsController = async (req, res, next) => {
  try {
    const userId = req?.Token?.id;
    const userType = req?.Token?.userType;

    // Check if user is authenticated
    if (!userId && !userType) {
      return errResponse(next, "User not authenticated", 401);
    }

    // Validate request data
    const { name, bio, company, dateOfBirth, designation, skills, photoUrl } =
      inputValidation(req, next, updateDetailsValidation);

    // dynamic model
    const model =
      userType === "hr"
        ? hrModel
        : userType === "admin"
        ? adminModel
        : employeeModel;

    // update user details
    const updatedUser = await model.findByIdAndUpdate(
      userId,
      {
        name,
        bio,
        company,
        dateOfBirth,
        designation,
        skills,
        photoUrl,
      },
      { new: true }
    );
    if (!updatedUser)
      return errResponse(next, "User details update failed", 404);

    // send response
    return okResponse(res, "User details updated successfully", updatedUser);
  } catch (error) {
    console.error(`Error in upateDetailsController : ${error.message}`);
    next(error);
  }
};

export const getUserDetailsController = async (req, res, next) => {
  try {
    const userId = req?.Token?.id;
    const userType = req?.Token?.userType;

    // Check if user is authenticated
    if (!userId && !userType) {
      return errResponse(next, "User not authenticated", 401);
    }

    // dynamic model
    const model =
      userType === "hr"
        ? hrModel
        : userType === "admin"
        ? adminModel
        : employeeModel;

    // get user details
    const user = await model.findById(userId);
    if (!user) return errResponse(next, "User not found", 404);

    // send response
    return okResponse(res, "User details fetched successfully", user);
  } catch (error) {
    console.error(`Error in getUserDetailsController : ${error.message}`);
    next(error);
  }
};

export const suffledUserListController = async (req, res, next) => {
  try {
    const userId = req?.Token?.id;

    // Check if user is authenticated
    if (!userId) {
      return errResponse(next, "User not authenticated", 401);
    }

    // Get random user list
    const [employees, admins, hrList] = await Promise.all([
      employeeModel.aggregate([
        { $sample: { size: 10 } },
        { $project: { _id: 1, name: 1, photoUrl: 1, bio: 1 } },
      ]),
      adminModel.aggregate([
        { $sample: { size: 10 } },
        { $project: { _id: 1, name: 1, photoUrl: 1, bio: 1, userType: 1 } },
      ]),
      hrModel.aggregate([
        { $sample: { size: 10 } },
        { $project: { _id: 1, name: 1, photoUrl: 1, bio: 1, userType: 1 } },
      ]),
    ]);

    // Combine all results into one array
    const allUsers = [...employees, ...admins, ...hrList];

    return okResponse(res, "Employee list fetched successfully", allUsers);
  } catch (error) {
    console.error(`Error in getEmployeeListController : ${error.message}`);
  }
};
