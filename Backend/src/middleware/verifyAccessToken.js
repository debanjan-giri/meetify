import { errMiddleware, verifyToken } from "../utils/reqResFunction.js";

export const verifyAccessToken = async (req, res, next) => {
  try {
    const authHeader = req?.headers?.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return errMiddleware({ next, error: "Unauthorized", statusCode: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Verify the token
    return verifyToken({
      next,
      res,
      req,
      token,
      tokenType: "access",
    });
  } catch (error) {
    return errMiddleware({
      next,
      error,
      controller: "verifyAccessToken",
    });
  }
};
