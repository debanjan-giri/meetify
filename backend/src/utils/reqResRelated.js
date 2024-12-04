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

export const okResponse = (res, message = "", responseData = {}, token) => {
  return res.status(200).json({
    success: true,
    message: message,
    data: responseData,
    token: token,
  });
};
