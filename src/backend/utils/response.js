exports.sendSuccess = (
  res,
  statusCode = 200,
  message = "Success",
  data = {}
) => {
  return res.status(statusCode).json({
    statusCode,
    success: true,
    message,
    data,
  });
};

exports.sendError = (
  res,
  statusCode = 500,
  message = "Something went wrong",
  errors = []
) => {
  return res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    errors,
  });
};
