import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { serverConsoleErr } from "./reqResRelated.js";

const createToken = (next, user, secretKey, expiry) => {
  try {
    const { _id: id } = user;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return serverConsoleErr(
        next,
        "Valid User ID is required for token generation"
      );
    }

    if (!secretKey || !expiry) {
      return serverConsoleErr(next, "Token secret and expiry are required");
    }
    const token = jwt.sign({ id }, secretKey, { expiresIn: expiry });
    return token;
  } catch (error) {
    return serverConsoleErr(next, `Token generation failed: ${error.message}`);
  }
};

export const generateAccessToken = (next, user) => {
  return createToken(
    next,
    user,
    process.env.ACCESS_TOKEN_SECRET,
    process.env.ACCESS_TOKEN_EXPIRY
  );
};

export const isRefreshTokenCreated = (res, next, user) => {
  try {
    const refreshtoken = createToken(
      next,
      user,
      process.env.REFRESH_TOKEN_SECRET,
      process.env.REFRESH_TOKEN_EXPIRY
    );
    res.cookie(process.env.REFRESH_COOKIES_SECRET, refreshtoken, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return true;
  } catch (error) {
    console.error("Error generating refresh token:", error);
    return next(error);
  }
};
