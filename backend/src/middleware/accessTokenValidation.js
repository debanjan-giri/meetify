import jwt from "jsonwebtoken";
import { errResponse } from "../utils/reqResRelated.js";
import { isValidId } from "../utils/utilityFunction.js";
import baseUserModel from "../models/accUserModel/baseUserModel.js";
import { userTypeConst } from "../models/typeConstant.js";

export const accessTokenValidation = async (req, res, next) => {
  try {
    const authHeader = req?.headers?.authorization;

    // Check for Bearer token in the Authorization header
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return errResponse(next, "Authorization token missing", 401);
    }

    // Extract the token from the header
    const token = authHeader.split(" ")[1];

    // Verify token and check if JWT_SECRET is defined
    if (!process.env.ACCESS_TOKEN_SECRET) {
      return next(new Error("ACCESS_TOKEN_SECRET is not defined"));
    }

    // Verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        const message =
          err.name === "TokenExpiredError"
            ? " Access Token has expired"
            : "invalid access token";
        return errResponse(next, message, 401);
      }

      const userId = isValidId(next, decoded.id);

      // Check if user exists in the database
      const user = await baseUserModel
        .findById(userId)
        .select("_id userType userAccess")
        .lean();
      if (!user) {
        return errResponse(next, "User not found in database", 404);
      }

      // check user access
      if (!user?.userAccess)
        return errResponse(next, "User access is disabled", 401);

      // check user type
      const userType = Object.values(userTypeConst).includes(user?.userType);
      if (!userType) {
        return errResponse(next, "You do not have permission", 403);
      }

      // Attach user data to request for further use
      req.token = { id: user?._id, userType: user?.userType };
      next();
    });
  } catch (error) {
    next(error);
  }
};
