const { StatusCodes } = require("http-status-codes");

const User = require("../model/user.model");
const Worker = require("../model/doctor.model");
const Doctor = require("../model/doctor.model");
const Patient = require("../model/patient.model");
const crud = require("./crud.controller");

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

const updateUser = crud.updateOne(User);
const deleteUser = crud.deleteOne(User);

const restrictedRoles = {
  hr: ["doctor", "worker"],
  registration: ["patient"],
  // doctor: ["patient"],
};

const isRestricted = (role, req) =>
  req.user.role == "admin" ||
  (restrictedRoles[req.user.role] &&
    restrictedRoles[req.user.role].includes(role));

const createUser = async (req, res, next) => {
  if (isRestricted(req.body.role, req) && req.body.role !== "admin") {
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

//==========  MIDDLEWARES  ==========
const getMe = async (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const setUserId = (req, res, next) => {
  req.body.userInput = req.user._id;
  next();
};

const deleteModelMid = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const Model =
    user.role == "doctor" ? Doctor : user.role == "worker" ? Worker : null;
  if (!Model) {
    return next();
  }

  await Model.findOneAndDelete({ user: user._id });
  next();
};

const deleteUserMid = (Model) => {
  return async (req, res, next) => {
    const data = await Model.findById(req.params.id);
    if (data) {
      await User.findByIdAndDelete(data.user);
    }
    next();
  };
};

const checkUser = (role) => {
  return async (req, res, next) => {
    if (req.body.user) {
      const user = await User.findById(req.body.user);
      // Check user existance
      if (!user) {
        return next(
          new AppError(
            `No user find with ${req.body.user} ID`,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      // Check role
      if (user.role != role) {
        return next(
          new AppError(
            `The user's role does not match with ${role}`,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      // Check user existance in models
      const Model =
        role == "doctor"
          ? Doctor
          : role == "worker"
          ? Worker
          : role == "patient"
          ? Patient
          : null;

      const data = await Model.findOne({ user: req.body.user });
      if (data) {
        return next(
          new AppError("The user already exists", StatusCodes.BAD_REQUEST)
        );
      }
    }
    next();
  };
};

module.exports = {
  createAdmin,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getMe,
  setUserId,
  getAllUsers,
  deleteModelMid,
  deleteUserMid,
  checkUser,
};
