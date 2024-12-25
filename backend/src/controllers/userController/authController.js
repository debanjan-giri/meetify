import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";
import {
  errResponse,
  okResponse,
  serverConsoleErr,
} from "../../utils/reqResRelated.js";

import {
  generateAccessToken,
  isRefreshTokenCreated,
} from "../../utils/tokenRelated.js";

import {
  createHash,
  inputValidation,
  isValidId,
} from "../../utils/utilityFunction.js";
import baseUserModel from "../../models/accUserModel/baseUserModel.js";
import { contentTypeConst, userTypeConst } from "../../models/typeConstant.js";
import {
  isCompany,
  isEmail,
  isName,
  isPassword,
  isUrl,
} from "../../validation/validationSchema.js";
import baseMediaModel from "../../models/unifyMedia/baseMediaModel.js";
import basePollModel from "../../models/unifyPoll/basePollModel.js";
import hashTagModel from "../../models/hashTagModel.js";

export const registerController = async (req, res, next) => {
  try {
    // Validate request data
    const { email, password, name, company, photoUrl } = inputValidation(
      req.body,
      next,
      Joi.object({
        email: isEmail.required(),
        password: isPassword.required(),
        name: isName.required(),
        company: isCompany.required(),
        photoUrl: isUrl,
      })
    );

    // admin login
    const isAdminUserType =
      email === process.env.ADMIN_EMAIL
        ? userTypeConst.ADMIN
        : userTypeConst.EMPLOYEE;

    // Hash password
    const hashedPassword = await createHash(password);

    // Prepare user data
    const userData = {
      name,
      email,
      company,
      password: hashedPassword,
      photoUrl,
      userType: isAdminUserType,
    };

    if (isAdminUserType === userTypeConst.ADMIN) {
      userData.hrIds = [];
      userData.adminIds = [];
      userData.employeeIds = [];
    }

    // Find existing user or create a new one
    const newUser = await baseUserModel.findOneAndUpdate(
      { email },
      {
        $setOnInsert: userData,
      },
      {
        new: true,
        upsert: true,
        rawResult: true,
      }
    );

    if (!newUser.lastErrorObject.updatedExisting) {
      const accessToken = generateAccessToken(next, newUser.value);
      const refreshToken = isRefreshTokenCreated(res, next, newUser.value);

      if (!accessToken || !refreshToken) {
        await baseUserModel.findByIdAndDelete(newUser.value._id);
        return errResponse(next, "Please register again", 500);
      }

      const response = {
        id: newUser.value._id,
        name: newUser.value.name,
        email: newUser.value.email,
        company: newUser.value.company,
        photoUrl: newUser.value.profilePhoto,
        userType: newUser.value.userType,
      };

      // Success response
      return okResponse(res, "User registered successfully", {
        data: response,
        token: accessToken,
      });
    } else {
      return errResponse(next, "User already exists", 409);
    }
  } catch (error) {
    console.error(`Error in registerController : ${error.message}`);
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    // Validate request data
    const { email, password } = inputValidation(
      req.body,
      next,
      Joi.object({
        email: isEmail.required(),
        password: isPassword.required(),
      })
    );

    // Check if user exists
    const userDetails = await baseUserModel
      .findOne({ email }, { userAccess: 1, email: 1, password: 1, _id: 1 })
      .lean();

    if (!userDetails || !userDetails.userAccess) {
      return errResponse(
        next,
        `${
          !userDetails.userAccess
            ? "user access is disabled"
            : "please register"
        }`,
        401
      );
    }
    // Compare the hashed password
    const isPasswordMatch = await bcrypt.compare(
      password,
      userDetails?.password
    );
    if (!isPasswordMatch)
      return errResponse(next, "Invalid email number or password", 401);

    // Generate JWT token
    const accesstoken = generateAccessToken(next, userDetails);

    // send refresh token in cookie
    const refreshtoken = isRefreshTokenCreated(res, next, userDetails);

    if (!accesstoken || !refreshtoken) {
      return errResponse(next, "retry login", 500);
    }

    // Remove sensitive fields manually
    delete userDetails.password;
    delete userDetails.__v;

    // Return success response
    return okResponse(res, "Login successful", {
      data: userDetails,
      token: accesstoken,
    });
  } catch (error) {
    console.error(`Error in loginController : ${error.message}`);
    next(error);
  }
};

export const getAccessTokenController = async (req, res, next) => {
  try {
    const key = process.env.REFRESH_COOKIES_SECRET;
    const refreshToken = req?.cookies?.[key];
    if (!refreshToken) {
      return errResponse(next, "Refresh token not found", 401);
    }

    if (!process.env.REFRESH_TOKEN_SECRET) {
      return serverConsoleErr(next, "REFRESH_TOKEN_SECRET is not defined");
    }

    // Verify the refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          const message =
            err.name === "TokenExpiredError"
              ? "Refresh token has expired"
              : "Invalid refresh token";
          return errResponse(next, message, 403); // Forbidden
        }

        if (!decoded.id) {
          return serverConsoleErr(next, "token id not found", 401);
        }

        const userId = isValidId(next, decoded.id);

        // Find the user in the database
        const userDetails = await baseUserModel
          .findById(userId)
          .select("userAccess , _id")
          .lean();

        if (!userDetails) {
          return errResponse(next, "User not found in database", 404);
        }

        if (!userDetails?.userAccess) {
          return errResponse(next, "User access is disabled", 401);
        }

        // Generate JWT token
        const accesstoken = generateAccessToken(next, userDetails);

        // send new refresh token in cookie
        const refreshtoken = isRefreshTokenCreated(res, next, userDetails);

        if (!accesstoken && !refreshtoken) {
          return errResponse(next, "User not authorized ", 500);
        }

        // Send the new access token in the response body
        res.json({ token: accesstoken });
      }
    );
  } catch (error) {
    console.error(`Error in getAccessTokenController : ${error.message}`);
    next(error);
  }
};

export const deleteAccountController = async (req, res, next) => {
  try {
    const { id: userId } = req?.token || {};
    if (!userId) return errResponse(next, "User not authenticated", 401);

    // Perform delete operations concurrently
    const deletePromises = [
      baseUserModel.findByIdAndDelete(userId),
      baseMediaModel.deleteMany({ creatorId: userId }),
      basePollModel.deleteMany({ creatorId: userId }),
      hashTagModel.deleteMany({ creatorId: userId }),
      baseMediaModel.deleteMany({ contentType: contentTypeConst.HASHTAG }),
      basePollModel.deleteMany({ contentType: contentTypeConst.HASHTAG }),
    ];

    // Wait for all delete operations to complete
    const [deletedUser] = await Promise.all(deletePromises);

    // Check if user deletion was successful
    if (!deletedUser) {
      return errResponse(next, "Failed to delete account", 500);
    }

    // Clear refresh token cookie
    res.clearCookie(process.env.REFRESH_COOKIES_SECRET, {
      httpOnly: true,
      secure: true,
    });

    return okResponse(res, "Account deleted successfully");
  } catch (error) {
    console.error(`Error in deleteAccountController: ${error.message}`);
    next(error);
  }
};
