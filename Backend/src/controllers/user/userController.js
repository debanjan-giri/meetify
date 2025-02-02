
export const updateDetailsController = async (req, res, next) => {
  try {
    const { userId } = req?.token;

    // Validate request data and directly filter out empty fields
    const validatedData = inputValidation(
      req.body,
      next,
      Joi.object({
        name: isName.optional().allow(""),
        bio: isBio.optional().allow(""),
        dateOfBirth: isDateOfBirth.optional().allow(""),
        designation: isDesignation.optional().allow(""),
      })
    );

    // Create update payload by omitting undefined or empty values
    const updatePayload = Object.fromEntries(
      Object.entries(validatedData).filter(([_, value]) => value)
    );

    // Early return if no valid fields are provided
    if (Object.keys(updatePayload).length === 0) {
      return errResponse(next, "No valid fields provided for update", 400);
    }

    // Update user details in the database
    const updatedUser = await baseUserModel
      .findByIdAndUpdate(userId, updatePayload, { new: true })
      .select("name bio dateOfBirth designation")
      .lean();

    // Return an error if the update fails
    if (!updatedUser) {
      return errResponse(next, "User details update failed", 404);
    }

    // Send the response
    return okResponse(res, "User details updated successfully", updatedUser);
  } catch (error) {
    console.error(`Error in updateDetailsController : ${error.message}`);
    next(error);
  }
};

export const getDetailsByIdController = async (req, res, next) => {
  try {
    const { employeeId } = inputValidation(
      req.params,
      next,
      Joi.object({
        employeeId: isId.required(),
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
    const { userId } = req?.token;

    const { photoUrl, isSubmit } = inputValidation(
      req.body,
      next,
      Joi.object({
        photoUrl: isUrl,
        isSubmit: isZeroOneType.required(),
      })
    );

    if (isSubmit === 1 && !photoUrl) {
      return errResponse(next, "photoUrl is required", 400);
    }

    // Prepare update data
    const updateData = isSubmit === 1 ? { photoUrl } : { photoUrl: null };

    // Update user details
    const updatedUser = await baseUserModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .select("_id")
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
    const { userId } = req?.token;

    // get user details
    const user = await baseUserModel
      .findById(userId)
      .select("name photoUrl bio company designation userType dateOfBirth")
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
        cursor: isString.optional(),
        limit: isNumber.optional(),
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
      .select("name profilePhoto userType _id")
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
    const { requestype, accountId } = inputValidation(
      req.body,
      next,
      Joi.object({
        requestype: isRequestype.required(),
        accountId: isId.required(),
      })
    );

    const isAccountId = isValidId(next, accountId);

    // send
    const updateConnection = async (dbId, update) => {
      const updatedUser = await baseUserModel
        .findByIdAndUpdate({ _id: dbId }, update, { new: true, upsert: false })
        .select("_id")
        .lean();
      return !!updatedUser;
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
          $addToSet: { connectionId: isAccountId },
          $pull: { requestId: isAccountId },
        };
        successMessage = "Connection request accepted successfully";
        break;

      case isRequestypeConst.REJECT:
        update = { $pull: { requestId: isAccountId } };
        successMessage = "Connection request rejected successfully";
        break;

      case isRequestypeConst.DELETE:
        update = { $pull: { connectionId: isAccountId } };
        successMessage = "Connection request deleted successfully";
        break;

      default:
        return errResponse(next, "Invalid request type", 400);
    }

    const dynamicAccId =
      requestype === isRequestypeConst.SEND ? userId : isAccountId;

    const updated = await updateConnection(dynamicAccId, update);

    if (!updated) {
      return errResponse(next, "operation failed", 404);
    }

    return okResponse(res, "operation success");
  } catch (error) {
    console.error(`Error in handleConnectionController: ${error.message}`);
    next(error);
  }
};

export const connectedRequestListController = async (req, res, next) => {
  try {
    const { userId } = req?.token;

    // Validate request data using Joi schema
    const {
      cursor,
      limit = 10,
      listType,
    } = inputValidation(
      req.query,
      next,
      Joi.object({
        cursor: isString.optional(),
        limit: isNumber.optional(),
        listType: isZeroOneType.required(),
      })
    );

    // Validate cursor and limit values
    const validCursor = isValidId(next, cursor);
    const limitValue = Math.min(Math.max(parseInt(limit, 10), 1), 100);
    if (isNaN(limitValue)) return errResponse(next, "Invalid limit value", 400);

    const listField = listType === 1 ? "myConnectionIds" : "myFdRequestIds";

    // Optimized Aggregation pipeline
    const user = await baseUserModel.aggregate([
      { $match: { _id: userId } },
      {
        $lookup: {
          from: "users",
          let: { connectionIds: `$${listField}` },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$connectionIds"] },
                ...(validCursor && { _id: { $gt: validCursor } }),
              },
            },
            { $project: { name: 1, photoUrl: 1, userType: 1, _id: 1 } },
            { $sort: { _id: 1 } },
            { $limit: limitValue + 1 },
          ],
          as: "userList",
        },
      },
      {
        $project: {
          userList: 1,
        },
      },
    ]);

    // Check if userList is empty
    if (!user?.[0]?.userList?.length) {
      return okResponse(res, "No users found");
    }

    const userList = user[0].userList;
    const hasNextPage = userList.length > limitValue;
    const trimmedUserList = hasNextPage
      ? userList.slice(0, limitValue)
      : userList;
    const nextCursor = hasNextPage
      ? trimmedUserList[trimmedUserList.length - 1]._id
      : null;

    const responseKey = listType === 1 ? "connectionIds" : "requestIds";

    // Return the result
    return okResponse(
      res,
      `${listType === 1 ? "Connected" : "Requested"} list fetched successfully`,
      {
        [responseKey]: trimmedUserList,
        nextCursor,
        hasNextPage,
      }
    );
  } catch (error) {
    console.error(`Error in connectedRequestListController: ${error.message}`);
    next(error);
  }
};

export const submitUnsubmitReportController = async (req, res, next) => {
  try {
    const { email, name } = req?.token;

    // Validate input
    const { contentId, isType } = inputValidation(
      req.body,
      next,
      Joi.object({
        contentId: isId.required(),
        isType: isZeroOneType.required(),
      })
    );

    const isContentId = isValidId(next, contentId);

    // Determine update fields
    const update =
      isType === 1
        ? {
            $set: {
              isReported: true,
              reportedObj: { reportedByName: name, reportedByEmail: email },
            },
          }
        : {
            $set: { isReported: false },
            $unset: { reportedObj: {} },
          };

    // Update reported details
    const updatedContent = await baseContentModel
      .findByIdAndUpdate(isContentId, update, { new: true, upsert: false })
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
