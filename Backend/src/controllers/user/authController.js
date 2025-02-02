import Joi from "joi";
import {
  isCompany,
  isEmail,
  isName,
  isPassword,
  isUrl,
} from "../../validation/atomSchema.js";
import {
  createHash,
  inputValidation,
  verifyHash,
} from "../../utils/utilityFunction.js";
import { USER_TYPE } from "../../constant/databaseConstant.js";
import {
  createToken,
  errMiddleware,
  okResponse,
  setRefreshTokenCookie,
  verifyToken,
} from "../../utils/reqResFunction.js";
import userModel from "../../models/user/userModel.js";

export const registerController = async (req, res, next) => {
  try {
    // validation
    const schema = Joi.object({
      email: isEmail.required(),
      password: isPassword.required(),
      name: isName.required(),
      company: isCompany.required(),
      photoUrl: isUrl,
    });

    const validatedData = inputValidation({
      data: req.body,
      next,
      schema,
    });

    // early return
    if (!validatedData) return;

    // Destructure
    const { email, password, name, company, photoUrl } = validatedData;

    // concurrently
    const [existingUser, hashedPassword] = await Promise.all([
      userModel.findOne({ email }).lean().select("_id"),
      createHash({ next, password }),
    ]);

    // early return
    if (existingUser) {
      return errMiddleware({
        next,
        error: "User already exists",
        statusCode: 409,
      });
    }

    const userData = {
      name,
      email,
      company,
      password: hashedPassword,
      photoUrl,
      userType: USER_TYPE.EMPLOYEE,
    };

    // pause the code because below code require user data
    const newUser = await userModel.create(userData);

    // early return
    if (!newUser) {
      return errMiddleware({
        next,
        error: "User registration failed",
        statusCode: 500,
      });
    }

    // run parallel
    const [accessToken, refreshToken] = await Promise.all([
      createToken({ next, tokenType: "access", userId: newUser?._id }),
      createToken({ next, tokenType: "refresh", userId: newUser?._id }),
    ]);

    if (!getAccessTokenController || !refreshToken) return;

    // Set secure HTTP-only cookie for refresh token
    setRefreshTokenCookie({ response: res, refreshToken });

    return okResponse({
      response: res,
      message: "User registered successfully",
      data: {
        id: newUser?._id,
        name: newUser?.name,
        email: newUser?.email,
        company: newUser?.company,
        photoUrl: newUser?.profilePhoto,
        userType: newUser?.userType,
      },
      token: accessToken,
    });
  } catch (error) {
    return errMiddleware({
      next,
      error,
      controller: "registerController",
    });
  }
};

export const loginController = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: isEmail.required(),
      password: isPassword.required(),
    });

    const validatedData = inputValidation({
      data: req.body,
      next,
      schema,
    });

    if (!validatedData) return;

    const { email, password } = validatedData;

    // Fetch user data first
    const userDetails = await userModel
      .findOne({ email })
      .select("_id name email company password photoUrl userType userAccess")
      .lean();

    if (!userDetails)
      return errMiddleware({
        next,
        error: "Invalid credentials",
        statusCode: 401,
      });

    if (!userDetails?.userAccess)
      return errMiddleware({
        next,
        error: "User access denied",
        statusCode: 403,
      });

    // Optimize password verification
    const isPasswordMatch = await verifyHash({
      next,
      hashedPassword: userDetails?.password,
      password,
    });

    if (!isPasswordMatch) return;

    // Generate tokens in parallel
    const [accessToken, refreshToken] = await Promise.all([
      createToken({ next, tokenType: "access", userId: userDetails._id }),
      createToken({ next, tokenType: "refresh", userId: userDetails._id }),
    ]);

    if (!accessToken || !refreshToken) return;

    setRefreshTokenCookie({ response: res, refreshToken });

    return okResponse({
      response: res,
      message: "User logged in successfully",
      data: {
        id: userDetails?._id,
        name: userDetails?.name,
        email: userDetails?.email,
        company: userDetails?.company,
        photoUrl: userDetails?.profilePhoto,
        userType: userDetails?.userType,
      },
      token: accessToken,
    });
  } catch (error) {
    return errMiddleware({
      next,
      error,
      controller: "loginController",
    });
  }
};

export const getAccessTokenController = async (req, res, next) => {
  try {
    const key = process.env.REFRESH_COOKIES_SECRET;
    const refreshToken = req?.cookies?.[key];

    if (!refreshToken) {
      return errMiddleware({
        next,
        error: "Refresh token not found",
        statusCode: 401,
      });
    }

    // Verify the refresh token
    return verifyToken({
      next,
      res,
      req,
      token: refreshToken,
      tokenType: "refresh",
    });
  } catch (error) {
    return errMiddleware({
      next,
      error,
      controller: "getAccessTokenController",
    });
  }
};

export const deleteAccountController = async (req, res, next) => {
  const tokenId = req?.tokenId;

  try {
    // Early return if no tokenId is present
    if (!tokenId) {
      return errMiddleware({
        next,
        error: "Unauthorized",
        statusCode: 404,
      });
    }

    const { password } = inputValidation({
      data: req.body,
      next,
      schema: Joi.object({
        password: isPassword.required(),
      }),
    });

    // Early return if validation fails
    if (!password) return;

    // Fetch user and validate password in a single query
    const userDetails = await userModel
      .findOne({ _id: tokenId })
      .select("password")
      .lean();

    // Handle invalid credentials early
    if (
      !userDetails ||
      !(await verifyHash({
        next,
        hashedPassword: userDetails.password,
        password,
      }))
    ) {
      return errMiddleware({
        next,
        error: "Invalid credentials",
        statusCode: 401,
      });
    }

    // Delete user and clear refresh token cookie in parallel
    const deleteUser = userModel
      .findByIdAndDelete(tokenId)
      .select("_id")
      .lean()
      .exec();
    const clearCookie = res.clearCookie(process.env.REFRESH_COOKIES_SECRET, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    await Promise.all([deleteUser, clearCookie]);

    // Return success response
    return okResponse({
      response: res,
      message: "Account deleted successfully",
    });
  } catch (error) {
    return errMiddleware({
      next,
      error,
      controller: "deleteAccountController",
    });
  }
};
