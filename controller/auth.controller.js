const AppError = require("../utils/appError");
const { StatusCodes } = require("http-status-codes");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

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
    throw new AppError(
      "Siz registratsiyadan o'tmagansiz. Ma'lumot olish uchun admin bilan bog'laning.",
      StatusCodes.UNAUTHORIZED
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
    throw new AppError(
      "Bu tokenga tegishli foydalanuvchi mavjud emas!",
      StatusCodes.UNAUTHORIZED
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
};

const restrictedRoles = {
  hr: ["doctor", "worker"],
  doctor: ["patient"],
};

exports.isCreateRestricted = (req, res, next) => {
  if (
    req.user.role == "admin" ||
    (restrictedRoles[req.user.role] &&
      restrictedRoles[req.user.role].includes(req.body.role))
  ) {
    next();
  } else {
    throw new AppError("Sizga mumkinmas", StatusCodes.FORBIDDEN);
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError("Sizga mumkinmas", StatusCodes.FORBIDDEN);
    }
    next();
  };
};

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

exports.login = async (req, res) => {
  const { login, password } = req.body;

  //   1) check if email and password exist
  if (!login || !password) {
    throw new AppError(
      "Iltimos login va parolni kiriting",
      StatusCodes.BAD_REQUEST
    );
  }

  //   2) check if user exist && password is correct
  const user = await User.findOne({ login }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError("Login yoki parolingiz xato.", StatusCodes.BAD_REQUEST);
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
