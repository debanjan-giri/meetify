import hrModel from "../../models/userModel/hrModel";
import { updateDetailsValidation } from "../../validation/validationSchema";

export const upateDetailsController = async (req, res, next) => {
  try {
    const userId = req?.Token?.id;
    const userType = req?.Token?.userType;

    // Check if user is authenticated
    if (!userId) {
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
  }
};

export const getUserSuggesstionController = async (req, res, next) => {
  try {
    const [employees, admins, hrList] = await Promise.all([
      employeeModel.aggregate([
        { $sample: { size: 10 } }, // Get 10 random employees
        { $project: { _id: 1, name: 1, photoUrl: 1, bio: 1 } }, // Select specific fields
      ]),
      adminModel.aggregate([
        { $sample: { size: 10 } }, // Get 10 random admins
        { $project: { _id: 1, name: 1, photoUrl: 1, bio: 1 } }, // Select specific fields
      ]),
      hrModel.aggregate([
        { $sample: { size: 10 } }, // Get 10 random HRs
        { $project: { _id: 1, name: 1, photoUrl: 1, bio: 1 } }, // Select specific fields
      ]),
    ]);

    // Combine all results into one array
    const allUsers = [...employees, ...admins, ...hrList];

    return okResponse(res, "Employee list fetched successfully", allUsers);
  } catch (error) {
    console.error(`Error in getEmployeeListController : ${error.message}`);
  }
};
