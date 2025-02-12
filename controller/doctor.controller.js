const crud = require("./crud.controller");
const Doctor = require("../model/doctor.model");
const { createUser } = require("./user.controller");

const createDoctor = async (req, res, next) => {
  req.body.role = "doctor";
  const userId = await createUser(req, res, next);
  req.body.user = userId;

  crud.createOne(Doctor, { path: "user" })(req, res, next);
};

const getAllDoctor = crud.getAll(Doctor, { path: "user" });
const getDoctor = crud.getOne(Doctor, { path: "user" });
const updateDoctor = crud.updateOne(Doctor);
const deleteDoctor = crud.deleteOne(Doctor);

module.exports = {
  createDoctor,
  getAllDoctor,
  getDoctor,
  updateDoctor,
  deleteDoctor,
};
