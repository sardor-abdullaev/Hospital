const { StatusCodes } = require("http-status-codes");

exports.errorHandler = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Unexpected error, please try again later.",
  };

  return res.status(customError.statusCode).json({ error: customError.msg });
};
