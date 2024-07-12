const { StatusCodes } = require("http-status-codes");

const User = require("../model/user.model");
const Worker = require("../model/doctor.model");
const Doctor = require("../model/doctor.model");

const AppError = require("../utils/appError");

const createAdmin = async () => {
  let admin = await User.findOne({ login: "admin", role: "admin" });
  if (admin) return;

  admin = await User.create({
    login: "admin",
    password: process.env.ADMIN_PASSWORD || "admin123",
    role: "admin",
  });
};

const restrictedRoles = {
  hr: ["doctor", "worker"],
  doctor: ["patient"],
};

const isRestricted = (role, req) =>
  req.user.role == "admin" ||
  (restrictedRoles[req.user.role] &&
    restrictedRoles[req.user.role].includes(role));

const createUser = async (req, res) => {
  if (isRestricted(req.body.role, req)) {
    const newUser = await User.create(req.body);
    newUser.password = undefined;

    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: newUser,
    });
  } else {
    return next(
      new AppError(
        "You have no right to perform this action!",
        StatusCodes.FORBIDDEN
      )
    );
  }
};

const updateUser = async (req, res, next) => {
  if (req.body.password) {
    const url = `${req.protocol}://${req.get("host")}/api/users/resetPassword`;
    return next(
      new AppError(
        `In order to update password use '${url}' route `,
        StatusCodes.BAD_REQUEST
      )
    );
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new AppError("No user found with that ID", StatusCodes.NOT_FOUND)
    );
  }

  const updatedUser = await User.findByIdAndUpdate(user._id, req.body, {
    runValidators: true,
    new: true,
  });

  res.status(StatusCodes.OK).json({
    status: "success",
    user: updatedUser,
  });
};

const deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new AppError("No user found with that ID.", StatusCodes.NOT_FOUND)
    );
  }

  await User.findByIdAndDelete(user._id);
  res.status(StatusCodes.OK).json({
    status: "success",
  });
};

const getMe = async (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new AppError("No user found with that ID.", StatusCodes.NOT_FOUND)
    );
  }

  const Model =
    user.role == "doctor" ? Doctor : user.role == "worker" ? Worker : null;

  let userPopulate;
  if (Model) {
    userPopulate = await Model.findOne({ user: user._id }).populate({
      path: "user",
      select: "login role",
    });
  }

  res.status(StatusCodes.OK).json({
    status: "success",
    userPopulate: userPopulate || user,
  });
};

const getAllUsers = async (req, res, next) => {
  const users = await User.find({ role: { $ne: "admin" } }).select(
    "login role"
  );

  let userPopulate;
  const usersPopulatePromise = users.map(async (user) => {
    userPopulate = null;

    const Model =
      user.role == "doctor" ? Doctor : user.role == "worker" ? Worker : null;

    if (Model) {
      userPopulate = await Model.findOne({ user: user._id })
        .select("fname mname lname")
        .populate({
          path: "user",
          select: "login role",
        });
    }

    return userPopulate || user;
  });

  const usersPopulate = await Promise.all(usersPopulatePromise);
  res.status(StatusCodes.OK).json({
    status: "success",
    results: usersPopulate.length,
    usersPopulate,
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
