const { StatusCodes } = require("http-status-codes");

const User = require("../model/user.model");
const Worker = require("../model/doctor.model");
const Doctor = require("../model/doctor.model");

const AppError = require("../utils/appError");
const { isRestricted } = require("./auth.controller");

const createAdmin = async () => {
  let admin = await User.findOne({ login: "admin", role: "admin" });
  if (admin) return;

  admin = await User.create({
    login: "admin",
    password: process.env.ADMIN_PASSWORD || "admin123",
    role: "admin",
  });
};

const createUser = async (req, res) => {
  if (isRestricted(req.body.role, req)) {
    const newUser = await User.create(req.body);
    newUser.password = undefined;
    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: newUser,
    });
  } else {
    return next(new AppError("Sizga mumkinmas", StatusCodes.FORBIDDEN));
  }
};

const updateUser = async (req, res, next) => {
  if (req.body.password) {
    const url = `${req.protocol}://${req.get("host")}/api/users/resetPassword`;
    return next(
      new AppError(
        `Parolni yangilash uchun ${url} routedan foydalaning.`,
        StatusCodes.BAD_REQUEST
      )
    );
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new AppError("Foydalanuvchi topilmadi.", StatusCodes.NOT_FOUND)
    );
  }

  if (isRestricted(user.role, req)) {
    const updatedUser = await User.findByIdAndUpdate(user._id, req.body, {
      runValidators: true,
      new: true,
    });

    res.status(StatusCodes.OK).json({
      status: "success",
      user: updatedUser,
    });
  } else {
    return next(new AppError("Sizga mumkinmas.", StatusCodes.FORBIDDEN));
  }
};

const deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new AppError("Foydalanuvchi topilmadi.", StatusCodes.NOT_FOUND)
    );
  }
  if (isRestricted(user.role, req)) {
    await User.findByIdAndDelete(user._id);
    res.status(StatusCodes.OK).json({
      status: "success",
    });
  } else {
    next(new AppError("Sizga mumkinmas.", StatusCodes.FORBIDDEN));
  }
};

const getMe = async (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new AppError("Foydalanuvchi topilmadi.", StatusCodes.NOT_FOUND)
    );
  }
  // TODO: need to add restrict function or not
  let userPopulate;

  [Worker, Doctor].forEach(async (Model) => {
    userPopulate =
      userPopulate ||
      (await Model.findOne({ user: user._id }).populate({
        path: "user",
        select: "login role",
      }));
  });

  res.status(StatusCodes.OK).json({
    status: "success",
    user: userPopulate,
  });
};

const getAllUsers = async (req, res, next) => {
  // TODO: need to add restrict function
  let userPopulate;
  const users = await User.find({ role: { $ne: "admin" } });
  const usersPopulate = users.map((user) => {
    userPopulate = null;
    [Worker, Doctor].forEach(async (Model) => {
      userPopulate =
        userPopulate ||
        (await Model.findOne(
          { user: user._id },
          { select: "name lname sname" }
        ).populate({ path: "user", select: "login role" }));
    });
    return userPopulate || {};
  });

  res.status(StatusCodes.OK).json({
    status: "success",
    users: usersPopulate,
  });
};

module.exports = {
  createAdmin,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getMe,
  getAllUsers,
};
