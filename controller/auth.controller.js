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

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError("Sizga mumkinmas", StatusCodes.FORBIDDEN);
    }
    next();
  };
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
    throw new AppError("Incorrect email or password", StatusCodes.BAD_REQUEST);
  }
  //   3) if everything ok, send token to client
  createSendToken(user, 200, res);
};