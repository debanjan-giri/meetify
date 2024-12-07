
// import {
//   inputValidation,
//   isValidId,
// } from "../../utils/utilityFunction.js";
// import { errResponse, okResponse } from "../../utils/reqResRelated.js";


// export const upateDetails = async (req, res, next) => {
//   try {
//     const userId = req?.Token?.id;
//     const userType = checkUserType(next, req?.Token?.userType);

//     // Validate request data
//     const { name, bio, company, dateOfBirth, designation, skills, photoUrl } =
//       inputValidation(req, next, updateDetailsValidation);

//     // dynamic model
//     const model =
//       userType === "hr"
//         ? hrModel
//         : userType === "admin"
//         ? adminModel
//         : employeeModel;

//     // update user details
//     const updatedUser = await model.findByIdAndUpdate(
//       userId,
//       {
//         name,
//         bio,
//         company,
//         dateOfBirth,
//         designation,
//         skills,
//         photoUrl,
//       },
//       { new: true }
//     );
//     if (!updatedUser)
//       return errResponse(next, "User details update failed", 404);

//     // send response
//     return okResponse(res, "User details updated successfully", updatedUser);
//   } catch (error) {
//     console.error(`Error in upateDetailsController : ${error.message}`);
//     next(error);
//   }
// };

// export const submitReported = async (req, res, next) => {
//   try {
//     const userId = req.token.id;
//     const { contentId, creatorId } = req.body;

//     // Validate content ID
//     const validContentId = isValidId(contentId);
//     if (!validContentId) return errResponse(next, "Invalid content ID", 400);

//     // Validate auther ID
//     const validCreatorId = isValidId(creatorId);
//     if (!validCreatorId) return errResponse(next, "Invalid creator ID", 400);

//     // Check if content exists
//     const content = await baseContentModel.findById(contentId);
//     if (!content) return errResponse(next, "Content not found", 404);

//     const reportDetails = {
//       contentId: validContentId,
//       creatorId: validCreatorId,
//       reportedById: userId,
//     };

//     // Find all admins and HRs and put reported details
//     const adminsAndHRs = await baseUserModel.find({
//       userType: { $in: [userTypeConst.ADMIN, userTypeConst.HR] },
//     });

//     if (!adminsAndHRs.length)
//       return errResponse(next, "No admins or HRs found", 404);

//     // Update field
//     const updatePromises = adminsAndHRs.map((user) =>
//       baseUserModel.findByIdAndUpdate(
//         user._id,
//         { $push: { reportedContentArray: reportDetails } },
//         { new: true }
//       )
//     );

//     // Await all updates
//     await Promise.all(updatePromises);

//     return okResponse(
//       res,
//       "Reported content successfully updated for admins and HRs"
//     );
//   } catch (error) {
//     console.error(`Error in reportedContentController: ${error.message}`);
//     next(error);
//   }
// };

// export const getMyDetails = async (req, res, next) => {
//   try {
//     const userId = req?.Token?.id;
//     const userType = checkUserType(next, req?.Token?.userType);

//     // Check if user is authenticated
//     if (!userId && !userType) {
//       return errResponse(next, "User not authenticated", 401);
//     }

//     // dynamic model
//     const model =
//       userType === "hr"
//         ? hrModel
//         : userType === "admin"
//         ? adminModel
//         : employeeModel;

//     // get user details
//     const user = await model.findById(userId);
//     if (!user) return errResponse(next, "User not found", 404);

//     // send response
//     return okResponse(res, "User details fetched successfully", user);
//   } catch (error) {
//     console.error(`Error in getUserDetailsController : ${error.message}`);
//     next(error);
//   }
// };

// export const suffledUserList = async (req, res, next) => {
//   try {
//     const userId = req?.Token?.id;

//     // Check if user is authenticated
//     if (!userId) {
//       return errResponse(next, "User not authenticated", 401);
//     }

//     // Get random user list
//     const [employees, admins, hrList] = await Promise.all([
//       employeeModel.aggregate([
//         { $sample: { size: 10 } },
//         { $project: { _id: 1, name: 1, photoUrl: 1, bio: 1 } },
//       ]),
//       adminModel.aggregate([
//         { $sample: { size: 10 } },
//         { $project: { _id: 1, name: 1, photoUrl: 1, bio: 1, userType: 1 } },
//       ]),
//       hrModel.aggregate([
//         { $sample: { size: 10 } },
//         { $project: { _id: 1, name: 1, photoUrl: 1, bio: 1, userType: 1 } },
//       ]),
//     ]);

//     // Combine all results into one array
//     const allUsers = [...employees, ...admins, ...hrList];

//     return okResponse(res, "Employee list fetched successfully", allUsers);
//   } catch (error) {
//     console.error(`Error in getEmployeeListController : ${error.message}`);
//     next(error);
//   }
// };

// export const getEmployeeDetails = async (req, res, next) => {
//   try {
//     const { employeeId } = req.body;

//     const eId = isValidId(employeeId);
//     const userType = checkUserType(next, req?.Token?.userType);

//     // dynamic model
//     const model =
//       userType === "hr"
//         ? hrModel
//         : userType === "admin"
//         ? adminModel
//         : employeeModel;

//     // get user details
//     const user = await model.findById(eId);
//     if (!user) return errResponse(next, "User not found", 404);

//     // send response
//     return okResponse(res, "User details fetched successfully", user);
//   } catch (error) {
//     console.error(`Error in getEmployeeDetailsController : ${error.message}`);
//     next(error);
//   }
// };

// export const handleConnection = async (req, res, next) => {
//   try {
//     const userId = req?.Token?.id;
//     const { type } = inputValidation(req, next, typeValidation);

//     // Validate the type
//     if (!type || !["send", "accept"].includes(type)) {
//       return errResponse(next, "Invalid type provided", 400);
//     }

//     const connectionId = isValidId(next, req?.body?.connectionId);

//     // Check if the user to connect with exists
//     const connection = await baseUserModel.findById(connectionId);
//     if (!connection) return errResponse(next, "User ID not found", 404);

//     let updateUser;

//     if (type === "send") {
//       // Handle sending the connection request
//       updateUser = await baseUserModel.findByIdAndUpdate(
//         userId,
//         { $addToSet: { requestId: connectionId } },
//         { new: true }
//       );
//       if (!updateUser)
//         return errResponse(next, "Connection request failed", 404);

//       return okResponse(
//         res,
//         "Connection request sent successfully",
//         updateUser
//       );
//     } else if (type === "accept") {
//       // Handle accepting the connection request
//       updateUser = await baseUserModel.findByIdAndUpdate(
//         userId,
//         {
//           $addToSet: { connectionId: connectionId },
//           $pull: { requestId: connectionId },
//         },
//         { new: true }
//       );
//       if (!updateUser)
//         return errResponse(next, "Connection request acceptance failed", 404);

//       return okResponse(
//         res,
//         "Connection request accepted successfully",
//         updateUser
//       );
//     } else {
//       return errResponse(next, "Invalid request type", 400);
//     }
//   } catch (error) {
//     console.error(`Error in handleConnectionController: ${error.message}`);
//     next(error);
//   }
// };

// export const removeConnection = async (req, res, next) => {
//   try {
//     const userId = req?.Token?.id;
//     const { type } = inputValidation(req, next, typeValidation);

//     // Validate the type
//     if (!type || !["fdrm", "rm"].includes(type)) {
//       return errResponse(next, "Invalid type provided", 400);
//     }

//     // Validate and sanitize the connectionId
//     const connectionId = isValidId(next, req.body.connectionId);
//     if (!connectionId) return;

//     // Check if the user (connection) exists
//     const user = await baseUserModel.findById(connectionId);
//     if (!user) return errResponse(next, "User ID not found", 404);

//     // Conditional removal based on type
//     let updatedUser;

//     if (type === "fdrm") {
//       // Remove from connectionId list
//       updatedUser = await baseUserModel.findByIdAndUpdate(
//         userId,
//         { $pull: { connectionId: connectionId } }, // Remove from connectionId
//         { new: true }
//       );
//     } else if (type === "rm") {
//       // Remove from requestId list
//       updatedUser = await baseUserModel.findByIdAndUpdate(
//         userId,
//         { $pull: { requestId: connectionId } }, // Remove from requestId
//         { new: true }
//       );
//     } else {
//       return errResponse(next, "Invalid Type", 400); // Handle invalid type
//     }

//     if (!updatedUser) {
//       return errResponse(next, "Failed to update user", 500);
//     }

//     // Send success response
//     return okResponse(
//       res,
//       `${type === "fdrm" ? "Connection" : "Request"} removed successfully`,
//       updatedUser
//     );
//   } catch (error) {
//     console.error(`Error in removeConnectionController: ${error.message}`);
//     next(error);
//   }
// };

// export const connectionList = async (req, res, next) => {
//   try {
//     const userId = req?.Token?.id;
//     const { type } = inputValidation(req, next, typeValidation);

//     // Validate the type
//     if (!type || !["request", "connection"].includes(type)) {
//       return errResponse(next, "Invalid type provided", 400);
//     }

//     // Prepare query based on the type
//     let userList;
//     if (type === "request") {
//       // Find the user and populate the requestId details
//       userList = await baseUserModel.findById(userId).populate({
//         path: "requestId",
//         model: "baseUserModel",
//         select: "name photoUrl company designation",
//       });
//     } else if (type === "connection") {
//       // Find the user and populate the connectionId details
//       userList = await baseUserModel.findById(userId).populate({
//         path: "connectionId",
//         model: "baseUserModel",
//         select: "name photoUrl company designation",
//       });
//     }

//     // Check if userList is found
//     if (!userList) return errResponse(next, `${type} list not found`, 404);

//     // Send response
//     return okResponse(res, `${type} list fetched successfully`, userList);
//   } catch (error) {
//     console.error(`Error in connectionListController: ${error.message}`);
//     next(error);
//   }
// };
