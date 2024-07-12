const AppError = require("../utils/appError");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

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
    next(new AppError("Foydalanuvchi topilmadi!", StatusCodes.NOT_FOUND));
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
