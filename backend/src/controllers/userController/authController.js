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
import { userTypeConst } from "../../models/typeConstant.js";
import {
  isCompany,
  isEmail,
  isName,
  isPassword,
  isUrl,
} from "../../validation/validationSchema.js";

export const registerController = async (req, res, next) => {
  try {
    // Validate request data
    const { email, password, name, company, profilePhoto } = inputValidation(
      req,
      next,
      Joi.object({
        email: isEmail,
        password: isPassword,
        name: isName,
        company: isCompany,
        profilePhoto: isUrl,
      })
    );

    // Check if user already exists
    const existingUser = await baseUserModel
      .findOne({ email }, { email: 1 })
      .lean();

    if (existingUser) return errResponse(next, "User already exists", 409);

    // Hash password
    const hashedPassword = await createHash(password);

    // admin login
    const isAdminEmail =
      email === process.env.ADMIN_EMAIL
        ? userTypeConst.ADMIN
        : userTypeConst.EMPLOYEE;

    // Create new user
    const newUser = await baseUserModel.create({
      name,
      email,
      company,
      password: hashedPassword,
      profilePhoto,
      userType: isAdminEmail,
    });
    if (!newUser) return errResponse(next, "User registration failed", 500);

    // Generate JWT token
    const accesstoken = generateAccessToken(next, newUser);

    // send refresh token in cookie
    const refreshtoken = isRefreshTokenCreated(res, next, newUser);

    if (!accesstoken && !refreshtoken) {
      await baseUserModel.findByIdAndDelete(newUser._id);
      return errResponse(next, "please register again", 500);
    }

    const setResponse = {
      name: newUser?.name,
      email: newUser?.email,
      company: newUser?.company,
      profilePhoto: newUser?.profilePhoto,
      userType: newUser?.userType,
    };

    // Success response
    return okResponse(res, "User registered successfully", {
      data: setResponse,
      token: accesstoken,
    });
  } catch (error) {
    console.error(`Error in registerController : ${error.message}`);
    next(error); // Pass errors to global error handler
  }
};

export const loginController = async (req, res, next) => {
  try {
    // Validate request data
    const { email, password } = inputValidation(
      req,
      next,
      Joi.object({
        email: isEmail,
        password: isPassword,
      })
    );

    // Check if user exists
    const user = await baseUserModel
      .findOne({ email }, { userAccess: 1, email: 1, password: 1, _id: 1 })
      .lean();

    if (!user)
      return errResponse(next, "Invalid email number or password", 401);

    // check user access
    if (!user?.userAccess)
      return errResponse(next, "User access is disabled", 401);

    // Compare the hashed password
    const isPasswordMatch = await bcrypt.compare(password, user?.password);
    if (!isPasswordMatch)
      return errResponse(next, "Invalid email number or password", 401);

    // Generate JWT token
    const accesstoken = generateAccessToken(next, user);

    // send refresh token in cookie
    const refreshtoken = isRefreshTokenCreated(res, next, user);

    if (!accesstoken && !refreshtoken) {
      return errResponse(next, "retry login", 500);
    }

    // Remove sensitive fields manually
    delete user.password;
    delete user.__v;
    delete user.userAccess;
    delete user._id;

    // Return success response
    return okResponse(res, "Login successful", {
      data: user,
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

        const id = isValidId(next, decoded.id);

        // Find the user in the database
        const user = await baseUserModel
          .findById(id)
          .select("userAccess , _id")
          .lean();

        if (!user) {
          return errResponse(next, "User not found in database", 404);
        }

        if (!user?.userAccess) {
          return errResponse(next, "User access is disabled", 401);
        }

        // Generate JWT token
        const accesstoken = generateAccessToken(next, user);

        // send new refresh token in cookie
        const refreshtoken = isRefreshTokenCreated(res, next, user);

        if (!accesstoken && !refreshtoken) {
          return errResponse(next, "User not authorized ", 500);
        }

        // Send the new access token in the response body
        res.json({ token: accesstoken });
      }
    );
  } catch (error) {
    console.error(`Error in getAccessTokenController : ${error.message}`);
    next(error); // Pass errors to the global error handler
  }
};

export const deleteAccountController = async (req, res, next) => {
  try {
    const userId = req?.token?.id;

    // Delete user account
    const deletedUser = await baseUserModel
      .findByIdAndDelete(userId)
      .select("_name")
      .lean();
    if (!deletedUser) return errResponse(next, "Failed to delete account", 500);

    // also delete hash tag and post

    // Clear refresh token cookie
    res.clearCookie(process.env.REFRESH_COOKIES_SECRET, {
      httpOnly: true,
      secure: true,
    });

    return okResponse(res, "Account deleted successfully", null);
  } catch (error) {
    console.error(`Error in deleteAccountController : ${error.message}`);
    next(error); // Pass errors to the global error handler
  }
};
