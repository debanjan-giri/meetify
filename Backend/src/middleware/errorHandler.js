export const errorHandler = (err, req, res, next) => {
  let statusCode =
    err?.statusCode && Number.isInteger(err?.statusCode)
      ? err?.statusCode
      : 500;

  let openErrMsg = err?.isOpenErrMsg || false;

  let userMessage =
    process.env.NODE_ENV === "dev"
      ? err?.message
      : process.env.NODE_ENV === "prod" && openErrMsg
      ? err?.message
      : "Server Error";

  return res.status(statusCode).json({
    success: false,
    message: userMessage || "Internal Server Error",
  });
};

export default errorHandler;
