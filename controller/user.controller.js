const { StatusCodes } = require("http-status-codes");
const User = require("../model/user.model");

const createAdmin = async () => {
  let admin = await User.findOne({ login: "admin", role: "admin" });
  if (admin) return;

  admin = await User.create({
    login: "admin",
    password: process.env.ADMIN_PASSWORD,
    role: "admin",
  });
};

const createUser = async (req, res) => {
  const newUser = await User.create(req.body);

  res.status(StatusCodes.CREATED).json({
    status: "success",
    data: newUser,
  });
};

module.exports = { createAdmin, createUser };
