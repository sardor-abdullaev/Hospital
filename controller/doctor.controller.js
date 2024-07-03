const express = require("express");

const Doctor = require("../model/doctor.model");
const User = require("../model/user.model");

const AppError = require("../utils/appError");
const { isRestricted } = require("./auth.controller");
const { StatusCodes } = require("http-status-codes");

const createDoctor = async (req, res, next) => {
  const user = await User.findById(req.body.user);

  if (!(isRestricted(user.role) || req.user._id == req.body.user)) {
    return next(new AppError("Sizga mumkinmas", StatusCodes.FORBIDDEN));
  }

  const doctor = await Doctor.create(req.body);
  res.status(StatusCodes.CREATED).json({
    status: "success",
    doctor,
  });
};
