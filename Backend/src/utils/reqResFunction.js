import jwt from "jsonwebtoken";

export const errMiddleware = ({
  next,
  error = "Something went wrong",
  controller = "Unknown",
  statusCode = 500,
}) => {
  if (error instanceof Error) {
    if (process.env.NODE_ENV === "dev") {
      console.error(`Error in : ${controller} : ${error?.message}`);
    }
    return next(error);
  } else {
    const err = new Error(error);
    err.statusCode = statusCode;
    err.isOpenErrMsg = true;
    if (process.env.NODE_ENV === "dev") {
      console.error(`Error : ${error}`);
    }
    return next(err);
  }
};

export const okResponse = ({
  response = {},
  statusCode = 200,
  message = "",
  data = {},
  ...rest
}) => {
  return (
    response &&
    response.status(statusCode).json({
      success: true,
      message: message,
      data: data,
      ...rest,
    })
  );
};

export const createToken = async ({ next, tokenType, userId }) => {
  try {
    if (!userId) {
      return errMiddleware({
        next,
        error: "Token creation failed",
        statusCode: 401,
      });
    }

    const secretKey =
      process.env[
        tokenType === "access" ? "ACCESS_TOKEN_SECRET" : "REFRESH_TOKEN_SECRET"
      ];
    const expiry =
      process.env[
        tokenType === "access" ? "ACCESS_TOKEN_EXPIRY" : "REFRESH_TOKEN_EXPIRY"
      ];

    return new Promise((resolve, reject) => {
      jwt.sign(
        { id: userId },
        secretKey,
        { expiresIn: expiry, algorithm: "HS256" },
        (err, token) => {
          if (err) {
            return reject(err);
          }
          resolve(token);
        }
      );
    });
  } catch (error) {
    return errMiddleware({
      controller: "createToken",
      next,
      error: "Something went wrong. Please login again",
    });
  }
};

export const setRefreshTokenCookie = ({ response, refreshToken }) => {
  response.cookie(process.env.REFRESH_COOKIES_SECRET, refreshToken, {
    httpOnly: true, // Prevent XSS attacks
    sameSite: "Strict", // CSRF protection
    secure: process.env.NODE_ENV === "production", // Only set 'secure' in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
  });
};

export const verifyToken = ({ next, res, req, token, tokenType }) => {
  try {

    // in future db check

    const secretKey =
      process.env[
        tokenType === "access" ? "ACCESS_TOKEN_SECRET" : "REFRESH_TOKEN_SECRET"
      ];
    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err || !decoded?.id) {
        return errMiddleware({ next, error: "Unauthorized", statusCode: 401 });
      }

      if (tokenType === "refresh") {
        const [accessToken, refreshToken] = await Promise.all([
          createToken({ next, tokenType: "access", userId: decoded.id }),
          createToken({ next, tokenType: "refresh", userId: decoded.id }),
        ]);
        if (!accessToken || !refreshToken) return;
        console.log(refreshToken);
        setRefreshTokenCookie({ response: res, refreshToken });

        return okResponse({
          response: res,
          message: "Token created successfully",
          token: accessToken,
        });
      } else {
        req.tokenId = decoded.id;
        return next();
      }
    });
  } catch (error) {
    return errMiddleware({
      next,
      error,
      controller: "verifyToken",
    });
  }
};
