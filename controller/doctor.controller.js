const crud = require("./crud.controller");
const Doctor = require("../model/doctor.model");

const createDoctor = crud.createOne(Doctor);
const getAllDoctor = crud.getAll(Doctor);
const getDoctor = crud.getOne(Doctor);
const updateDoctor = crud.updateOne(Doctor);
const deleteDoctor = crud.deleteOne(Doctor);

module.exports = {
  createDoctor,
  getAllDoctor,
  getDoctor,
  updateDoctor,
  deleteDoctor,
};
