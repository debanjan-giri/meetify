export const errResponse = (
  next,
  message = "Something went wrong",
  statusCode = 203
) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.clientError = true; // differ between server and client errors
  next(error);
};

export const okResponse = (
  res,
  message = "",
  responseData = {},
  status = 200 // for custom status ( low res payload)
) => {
  return res.status(status).json({
    success: true,
    message: message,
    data: responseData,
  });
};

export const serverConsoleErr = (next, message) => {
  return next(new Error(message));
};
