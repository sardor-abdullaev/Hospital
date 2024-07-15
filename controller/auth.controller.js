const AppError = require("../utils/appError");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../model/user.model");

//==========  MIDDLEWARES  ==========

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

exports.passwordExists = (req, res, next) => {
  if (req.body.password) {
    const url = `${req.protocol}://${req.get("host")}/api/users/resetPassword`;
    return next(
      new AppError(
        `In order to update password use '${url}' route `,
        StatusCodes.BAD_REQUEST
      )
    );
  }
  next();
};

//==========  FUNCTIONS  ==========

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  //   cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// const saveEnterTime = async (userId) => {
//   const user = await User.findById(userId);
//   user.loginAt.push({ enter: Date.now() });
//   await user.save();
// };

const saveExitTime = async (userId) => {
  const user = await User.findById(userId);
  if (user) {
    user.loginAt[user.loginAt.length - 1].exit = Date.now();
    await user.save();
  }
};

//==========  CONTROLLERS  ==========

exports.login = async (req, res, next) => {
  const { login, password } = req.body;

  //   1) check if email and password exist
  if (!login || !password) {
    return next(
      new AppError(
        "Please provide login and password, please.",
        StatusCodes.BAD_REQUEST
      )
    );
  }

  //   2) check if user exist && password is correct
  const user = await User.findOne({ login }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError("Login or password is incorrect.", StatusCodes.BAD_REQUEST)
    );
  }

  // 3) save entered time
  user.loginAt.push({ enter: Date.now() });
  await user.save();

  //   4) if everything ok, send token to client
  createSendToken(user, 200, res);
};

exports.logout = (req, res) => {
  saveExitTime(req.user._id);
  req.user = null;

  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.resetToDefaultPassword = async (req, res, next) => {
  const user = await User.findById(req.body.user);
  if (!user) {
    next(new AppError("No user found with that ID!", StatusCodes.NOT_FOUND));
  }

  user.password = process.env.DEFAULT_PASSWORD || "test123";
  await user.save();

  res.status(200).json({
    status: "success",
  });
};

exports.updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.correctPassword(req.body.password, user.password))) {
    return next(new AppError("Incorrect password.", StatusCodes.UNAUTHORIZED));
  }

  user.password = req.body.newpassword;
  await user.save();

  res.status(StatusCodes.OK).json({
    status: "success",
  });
};
