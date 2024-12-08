// error handler
export const errorHandler = (err, req, res, next) => {
  const { message = "Internal Server Error", statusCode = 500 } = err;
  console.error(`Error: ${message}`);

  if (err?.clientError) {
    return res.status(statusCode).json({
      success: false,
      message: message,
    });
  }
  return res.status(statusCode).json({
    success: false,
    message: "Server Error",
  });
};

export default errorHandler;
