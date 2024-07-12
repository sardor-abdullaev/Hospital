const { StatusCodes } = require("http-status-codes");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const AppError = require("../utils/appError");

exports.protect = async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    next(
      new AppError(
        "You are not currently logged in. For additional information, please contact the administrator or HR department.",
        StatusCodes.UNAUTHORIZED
      )
    );
  }

  // 2) Verification token
  // jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  //   console.log(decoded);
  // });
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    next(
      new AppError(
        "There is no user assigned to this token.",
        StatusCodes.UNAUTHORIZED
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next();
    } else if (roles.includes("self")) {
      // If 'self' is included in roles array, prevent possible leak
      req.body.user = req.params.id ? null : req.user._id;
      req.params.id = req.body.user ? null : req.params.id;

      // Check if the user can perform the action based on specific conditions
      if (
        (req.user._id == req.body.user || req.user._id == req.params.id) &&
        (req.user.role == "doctor" || req.user.role == "worker")
      ) {
        return next();
      } else {
        return next(
          new AppError(
            "You do not have permission to perform this action",
            StatusCodes.FORBIDDEN
          )
        );
      }
    } else
      return next(
        new AppError(
          "You do not have permission to perform this action",
          StatusCodes.FORBIDDEN
        )
      );
  };
};

exports.setUserId = (req, res, next) => {
  req.body.user = req.user._id;
  next();
};
