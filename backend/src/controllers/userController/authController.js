import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerValidation } from "../../validation/validationSchema.js";

import {
  errResponse,
  generateAccessToken,
  okResponse,
  generateRefreshToken,
  inputValidation,
} from "../../utils/common.js";
import { createHash } from "../../utils/common.js";
import employeeModel from "../../models/userModel/employeeModel.js";

export const registerController = async (req, res, next) => {
  try {
    // Validate request data
    const { email, password, name, company } = inputValidation(
      req,
      next,
      registerValidation
    );

    // Check if user already exists
    const existingUser = await employeeModel.findOne({ email }).select("_id");
    if (existingUser) return errResponse(next, "User already exists", 409);

    // Hash password
    const hashedPassword = await createHash(password);

    // Create new user
    const newUser = await employeeModel.create({
      name,
      email,
      company,
      password: hashedPassword,
      userAccess: true,
    });
    if (!newUser) return errResponse(next, "User registration failed", 500);

    // Generate JWT token
    const accesstoken = generateAccessToken(next, newUser);

    // send refresh token in cookie
    const refreshtoken = generateRefreshToken(res, next, newUser);

    if (!accesstoken && !refreshtoken) {
      await authModel.deleteOne({ _id: newUser._id });
      return errResponse(next, "auth token generation failed", 500);
    }

    // Success response
    return okResponse(res, "User registered successfully", newUser);
  } catch (error) {
    console.error(`Error in registerController : ${error.message}`);
    next(error); // Pass errors to global error handler
  }
};

export const loginController = async (req, res, next) => {
  try {

    // Validate request data
    const value = inputValidation(req, registerValidation);

    const { email, password } = value;

    // Check if user exists
    const user = await employeeModel.findOne({ email });
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
    const refreshtoken = generateRefreshToken(res, next, user);

    if (!accesstoken && !refreshtoken) {
      return errResponse(next, "auth token generation failed", 500);
    }

    // Return success response
    return okResponse(res, "Login successful", user);
  } catch (error) {
    console.error(`Error in loginController : ${error.message}`);
    next(error);
  }
};

export const getAccessTokenController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
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
        const user = await authModel.findById(decoded.id).select("_id");
        if (!user) {
          return errResponse(next, "User not found in database", 404);
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

export const deleteAccountController = async (req, res, next) => {
  try {
    const { id } = req.Token;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return errResponse(next, "Valid User ID is required", 400);
    }

    // Delete user account
    const deletedUser = await employeeModel.findByIdAndDelete(id);
    if (!deletedUser) return errResponse(next, "Failed to delete account", 500);

    return okResponse(res, "Account deleted successfully", null);
  } catch (error) {
    console.error(`Error in deleteAccountController : ${error.message}`);
    next(error); // Pass errors to the global error handler
  }
};