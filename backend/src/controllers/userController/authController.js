import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { errResponse, okResponse } from "../../utils/reqResRelated.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/tokenRelated.js";

import { createHash, inputValidation } from "../../utils/utilityFunction.js";
import baseUserModel from "../../models/accUserModel/baseUserModel.js";
import { userTypeConst } from "../../models/typeConstant.js";
import {
  isCompany,
  isEmail,
  isName,
  isPassword,
} from "../../validation/validationSchema.js";

// register
export const register = async (req, res, next) => {
  try {
    // Validate request data
    const { email, password, name, company } = inputValidation(
      req,
      next,
      Joi.object({
        email: isEmail,
        password: isPassword,
        name: isName,
        company: isCompany,
      })
    );

    // Check if user already exists
    const existingUser = await baseUserModel
      .findOne({ email })
      .select("email")
      .lean();
    if (existingUser) return errResponse(next, "User already exists", 409);

    // Hash password
    const hashedPassword = await createHash(password);

    // admin login
    const isAdminEmail = email === process.env.ADMIN_EMAIL ? true : false;

    // Create new user
    const newUser = await baseUserModel.create({
      name,
      email,
      company,
      password: hashedPassword,
      userAccess: true,
      userType: isAdminEmail ? userTypeConst.ADMIN : userTypeConst.EMPLOYEE,
    });
    if (!newUser) return errResponse(next, "User registration failed", 500);

    // Generate JWT token
    const accesstoken = generateAccessToken(next, newUser);

    // send refresh token in cookie
    const refreshtoken = generateRefreshToken(res, next, newUser);

    if (!accesstoken && !refreshtoken) {
      await baseUserModel.deleteOne({ _id: newUser._id });
      return errResponse(next, "please register again", 500);
    }

    // Success response
    return okResponse(
      res,
      "User registered successfully",
      newUser,
      accesstoken
    );
  } catch (error) {
    console.error(`Error in register : ${error.message}`);
    next(error); // Pass errors to global error handler
  }
};

// login
export const login = async (req, res, next) => {
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
      .findOne({ email })
      .select("email", "password", "userAccess")
      .lean();

    if (!user)
      return errResponse(next, "Invalid email number or password", 401);

    // check user access
    if (!user?.userAccess)
      return errResponse(next, "User access is disabled", 401);

    // Compare the hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return errResponse(next, "Invalid email number or password", 401);

    // Generate JWT token
    const accesstoken = generateAccessToken(next, user);

    // send refresh token in cookie
    const refreshtoken = generateRefreshToken(res, next, user);

    if (!accesstoken && !refreshtoken) {
      return errResponse(next, "retry login", 500);
    }

    // Return success response
    return okResponse(res, "Login successful", user, accesstoken);
  } catch (error) {
    console.error(`Error in login : ${error.message}`);
    next(error);
  }
};

// get access token
export const getAccessToken = async (req, res, next) => {
  try {
    const key = process.env.REFRESH_COOKIES_SECRET;
    const refreshToken = req?.cookies?.[key];
    if (!refreshToken) {
      return errResponse(next, "Refresh token not found", 401);
    }

    if (!process.env.REFRESH_TOKEN_SECRET) {
      return next(new Error("REFRESH_TOKEN_SECRET is not defined"));
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
          return errResponse(next, "Invalid refresh token", 401);
        }

        // Find the user in the database
        const user = await baseUserModel
          .findById(decoded.id)
          .select("_id , userAccess")
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
        const refreshtoken = generateRefreshToken(res, next, user);

        if (!accesstoken && !refreshtoken) {
          return errResponse(next, "User not authorized ", 500);
        }

        // Send the new access token in the response body
        res.json({ token: accesstoken });
      }
    );
  } catch (error) {
    console.error(`Error in refreshTokenController : ${error.message}`);
    next(error); // Pass errors to the global error handler
  }
};

// Delete user account
export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req?.Token?.id;

    // Delete user account
    const deletedUser = await baseUserModel.findByIdAndDelete(userId);
    if (!deletedUser) return errResponse(next, "Failed to delete account", 500);

    // also delete hash tag
    await hashTagModel.deleteMany({ creatorId: userId });

    // also change content model
    await baseContentModel.deleteMany({ creatorId });

    // Clear refresh token cookie
    res.clearCookie(process.env.REFRESH_COOKIES_SECRET, {
      httpOnly: true,
      secure: true,
    });

    return okResponse(res, "Account deleted successfully", null);
  } catch (error) {
    console.error(`Error in deleteAccount : ${error.message}`);
    next(error); // Pass errors to the global error handler
  }
};
